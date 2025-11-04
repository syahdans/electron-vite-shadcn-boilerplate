import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import crypto from 'node:crypto'
import axios from 'axios'
// import { NFC } from 'nfc-pcsc'

/**
 * Generate authentication headers based on method and path
 */
function generate_headers(method: string, pathWithQueryParam: string) {
  const clientId = (import.meta as any).env.MV_MEKARI_CLIENT_ID || ''
  const clientSecret = (import.meta as any).env.MV_MEKARI_CLIENT_SECRET || ''

  let datetime = new Date().toUTCString()
  let requestLine = `${method} ${pathWithQueryParam} HTTP/1.1`
  let payload = [`date: ${datetime}`, requestLine].join('\n')
  let signature = crypto.createHmac('SHA256', clientSecret).update(payload).digest('base64')

  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Date: datetime,
    Authorization: `hmac username="${clientId}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    autoHideMenuBar: true,

    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    // mainWindow.maximize()
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('talenta:request', async (_, args) => {
    console.log('[main] mekari:request', args?.method, args?.pathWithQuery)

    const base_url = (import.meta as any).env.MV_BASE_URL
    const method = args?.method
    const pathWithQuery = args?.pathWithQuery

    const options = {
      method: method,
      url: `${base_url}${pathWithQuery}`,
      headers: generate_headers(method, pathWithQuery)
    }

    // Initiate request
    axios(options)
      .then(function (response) {
        console.log(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response)
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request)
        } else {
          console.log('Error', error.message)
        }
      })
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // --- NFC reader

  // const nfc = new NFC() // optionally you can pass logger

  // nfc.on('reader', (reader) => {
  //   console.log(`${reader.reader.name}  device attached`)

  //   // enable when you want to auto-process ISO 14443-4 tags (standard=TAG_ISO_14443_4)
  //   // when an ISO 14443-4 is detected, SELECT FILE command with the AID is issued
  //   // the response is available as card.data in the card event
  //   // see examples/basic.js line 17 for more info
  //   // reader.aid = 'F222222222';

  //   reader.on('card', (card) => {
  //     // card is object containing following data
  //     // [always] String type: TAG_ISO_14443_3 (standard nfc tags like MIFARE) or TAG_ISO_14443_4 (Android HCE and others)
  //     // [always] String standard: same as type
  //     // [only TAG_ISO_14443_3] String uid: tag uid
  //     // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response

  //     console.log(`${reader.reader.name}  card detected`, card)
  //   })

  //   reader.on('card.off', (card) => {
  //     console.log(`${reader.reader.name}  card removed`, card)
  //   })

  //   reader.on('error', (err) => {
  //     console.log(`${reader.reader.name}  an error occurred`, err)
  //   })

  //   reader.on('end', () => {
  //     console.log(`${reader.reader.name}  device removed`)
  //   })
  // })

  // nfc.on('error', (err) => {
  //   console.log('an error occurred', err)
  // })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
