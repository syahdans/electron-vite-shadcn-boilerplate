import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      requestTalenta(method: string, pathWithQuery: string)
      onNfcCardData(callback: (data: any) => void): () => void
      onNfcReaderStatus(callback: (data: any) => void): () => void
      onNfcCardTap(callback: (data: any) => void): () => void
      getNfcStatus(): Promise<{ active: boolean }>
    }
  }
}
