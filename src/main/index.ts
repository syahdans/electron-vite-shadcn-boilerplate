import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import crypto from 'node:crypto'
import axios from 'axios'
// NFC interactions are handled via dynamic import of './nfc-handler.js'
let nfcHandler: any | null = null

process.on('uncaughtException', (err) => {
  console.error('[Main] Uncaught exception:', err)
})

process.on('unhandledRejection', (reason) => {
  console.error('[Main] Unhandled rejection:', reason)
})

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
    title: 'HR WMPL',

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
  electronApp.setAppUserModelId('com.wmpl.hr')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle('talenta:request', async (_, args) => {
    const base_url = (import.meta as any).env.MV_BASE_URL
    const method = args?.method
    const pathWithQuery = args?.pathWithQuery

    const options = {
      method: method,
      url: `${base_url}${pathWithQuery}`,
      headers: generate_headers(method, pathWithQuery)
    }

    try {
      const res = await axios(options)
      return {
        ok: res.status >= 200 && res.status < 300,
        status: res.status,
        data: res.data.data
      }
    } catch (err: any) {
      return {
        ok: false,
        status: err?.response?.status ?? 0,
        data: err?.response?.data?.errors ?? [],
        error: err?.message ?? 'Request failed'
      }
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Initialize NFC handler dynamically
  ;(async () => {
    try {
      const mod = await import('./nfc-handler.js')
      const ElectronNFCHandler = (mod as any).default
      if (ElectronNFCHandler) {
        nfcHandler = new ElectronNFCHandler()
        console.log('NFC Handler initialized successfully')
      }
    } catch (error) {
      console.error('NFC Handler not found, running without NFC functionality')
    }
  })()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    try {
      nfcHandler?.shutdown?.()
    } catch {}
    app.quit()
  }
})

app.on('before-quit', () => {
  try {
    nfcHandler?.shutdown?.()
  } catch {}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
