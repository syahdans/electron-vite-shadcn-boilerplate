import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  async requestTalenta(method: string, pathWithQuery: string) {
    return await ipcRenderer.invoke('talenta:request', { method, pathWithQuery })
  },
  onNfcReaderStatus(callback: (data: any) => void) {
    const listener = (_event: any, payload: any) => callback(payload)
    ipcRenderer.on('nfc-reader-status', listener)
    return () => ipcRenderer.removeListener('nfc-reader-status', listener)
  },
  onNfcCardTap(callback: (data: any) => void) {
    const listener = (_event: any, payload: any) => callback(payload)
    ipcRenderer.on('nfc-card-tap', listener)
    return () => ipcRenderer.removeListener('nfc-card-tap', listener)
  },
  onNfcCardData(callback: (data: any) => void) {
    const listener = (_event: any, payload: any) => callback(payload)
    ipcRenderer.on('nfc-card-data', listener)
    return () => ipcRenderer.removeListener('nfc-card-data', listener)
  },
  onNfcCardRemoved(callback: (data: any) => void) {
    const listener = (_event: any, payload: any) => callback(payload)
    ipcRenderer.on('nfc-card-removed', listener)
    return () => ipcRenderer.removeListener('nfc-card-removed', listener)
  },
  async writeNfc(payload: any) {
    try {
      return await ipcRenderer.invoke('nfc:write', payload)
    } catch (e) {
      return { success: false, error: (e as any)?.message || String(e) }
    }
  },
  async getNfcStatus() {
    try {
      return await ipcRenderer.invoke('nfc:status')
    } catch (e) {
      return { active: false }
    }
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  ;(window as any).electron = electronAPI
  // @ts-ignore (define in dts)
  ;(window as any).api = api
}
