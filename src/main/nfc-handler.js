import { BrowserWindow } from 'electron'
import { NFC, KEY_TYPE_A } from 'nfc-pcsc'

class ElectronNFCHandler {
  constructor() {
    this.nfc = new NFC()
    this.reader = null
    this.card = null
    this.onReader = this.onReader.bind(this)
    this.onError = this.onError.bind(this)
    this.nfc.on('reader', this.onReader)
    this.nfc.on('error', this.onError)
  }

  async onReader(reader) {
    this.reader = reader
    console.log(`${reader.reader.name} device attached`)
    reader.on('card', (card) => this.onCard(reader, card))
    reader.on('card.off', () => {
      this.card = null
      console.log(`${reader.reader.name} card removed`)
    })
    reader.on('error', (err) => {
      console.error(`${reader.reader.name} error:`, err)
    })
    reader.on('end', () => {
      console.log(`${reader.reader.name} device removed`)
    })
  }

  async onCard(reader, card) {
    this.card = card
    console.log(`${reader.reader.name} card detected`, card)
    try {
      const data = await this.readClassicJSON(reader)
      if (data) {
        console.log('NFC JSON data:', data)
        this.sendToRenderer('nfc-card-data', data)
      }
    } catch (e) {
      console.error('NFC read error:', e)
    }
  }

  async readClassicJSON(reader) {
    const key = 'FFFFFFFFFFFF'
    const blocks = [4, 5, 6, 8, 9, 10]
    const chunks = []
    for (const block of blocks) {
      await reader.authenticate(block, KEY_TYPE_A, key)
      const d = await reader.read(block, 16, 16)
      chunks.push(Buffer.from(d))
    }
    const buf = Buffer.concat(chunks)
    const start = buf.indexOf(0x7b)
    const end = buf.lastIndexOf(0x7d)
    let str
    if (start !== -1 && end !== -1 && end > start) {
      str = buf.slice(start, end + 1).toString('utf8').replace(/^\ufeff/, '').trim()
    } else {
      str = buf.toString('utf8').replace(/\u0000+$/g, '').replace(/^\ufeff/, '').trim()
    }
    if (!str) return null
    try {
      return JSON.parse(str)
    } catch {
      console.log('NFC raw data:', str)
      return null
    }
  }

  async readSector1Text() {
    if (!this.reader || !this.card) {
      return { success: false, error: 'No card present. Please place a card on the reader.' }
    }
    const key = 'FFFFFFFFFFFF'
    const blocks = [4, 5, 6]
    const chunks = []
    for (const block of blocks) {
      await this.reader.authenticate(block, KEY_TYPE_A, key)
      const d = await this.reader.read(block, 16, 16)
      chunks.push(Buffer.from(d))
    }
    const buf = Buffer.concat(chunks)
    const text = buf.toString('utf8').replace(/\u0000+$/g, '').replace(/^\ufeff/, '').trim()
    return {
      success: true,
      text,
      rawHex: buf.toString('hex').toUpperCase(),
      timestamp: new Date().toISOString()
    }
  }

  async writeSector1Text(text) {
    if (!this.reader || !this.card) {
      return { success: false, error: 'No card present. Please place a card on the reader.' }
    }
    if (!text || text.trim().length === 0) {
      return { success: false, error: 'Text cannot be empty' }
    }
    if (Buffer.byteLength(text, 'utf8') > 48) {
      return { success: false, error: 'Text too long (maximum 48 bytes)' }
    }

    const key = 'FFFFFFFFFFFF'
    const blocks = [4, 5, 6]
    const textBuf = Buffer.from(text, 'utf8')
    const padded = Buffer.alloc(48)
    textBuf.copy(padded)

    for (const block of blocks) {
      const idx = block - 4
      const slice = padded.slice(idx * 16, (idx + 1) * 16)
      await this.reader.authenticate(block, KEY_TYPE_A, key)
      await this.reader.write(block, slice, 16)
    }

    const verification = await this.readSector1Text()
    const verified = verification.success && (verification.text || '').trim() === text.trim()
    return {
      success: true,
      message: `Text "${text}" written successfully to sector 1`,
      verified,
      timestamp: new Date().toISOString()
    }
  }

  onError(err) {
    console.error('NFC error:', err)
  }

  sendToRenderer(channel, data) {
    BrowserWindow.getAllWindows().forEach((win) => {
      try {
        win.webContents.send(channel, data)
      } catch {}
    })
  }

  shutdown() {
    try {
      this.reader?.removeAllListeners()
      this.nfc?.removeAllListeners()
      this.reader?.close?.()
    } catch {}
  }
}

export default ElectronNFCHandler
