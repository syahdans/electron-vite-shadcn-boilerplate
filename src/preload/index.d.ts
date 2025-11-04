import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      requestTalenta(method: string, pathWithQuery: string)
    }
  }
}
