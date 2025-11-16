import { BrowserWindow, ipcMain } from 'electron'
import { NFC, KEY_TYPE_A } from 'nfc-pcsc'

/**
 * NFC handler focused on MIFARE Classic (ISO 14443-3)
 * - Reads JSON stored across data blocks starting from sector 1 (block 4)
 * - Supports long names by reading multiple sectors until a full JSON is parsed
 * - Optional write helper to store JSON starting at sector 1
 */
class ElectronNFCHandlerNew {
  constructor(options = {}) {
    this.nfc = new NFC()
    this.reader = null
    this.card = null
    this.active = false
    this.keyA = options.keyA || 'FFFFFFFFFFFF'
    this.startSector = options.startSector || 1 // sector 1 (blocks 4..7)
    this.maxSectors = options.maxSectors || 10 // 10 sectors => up to 480 bytes (3 blocks * 16 * 10)
    this.onReader = this.onReader.bind(this)
    this.onError = this.onError.bind(this)
    this.nfc.on('reader', this.onReader)
    this.nfc.on('error', this.onError)

    try {
      ipcMain.handle('nfc:status', async () => {
        return { active: this.active }
      })
    } catch {}
  }

  onError(err) {
    console.error('NFC error:', err)
  }

  async onReader(reader) {
    this.reader = reader
    console.log(`${reader.reader.name} device attached`)
    this.active = true
    try {
      this.sendToRenderer('nfc-reader-status', { active: true })
    } catch {}

    reader.on('card', async (card) => {
      // MIFARE Classic uses ISO 14443-3; ignore others
      console.log(`${reader.reader.name} card detected`, card)
      this.card = card

      try {
        try {
          this.sendToRenderer('nfc-card-tap', { uid: card?.uid, ts: new Date().toISOString() })
        } catch {}
        // short settle
        await new Promise((r) => setTimeout(r, 60))
        const parsed = await this.readClassicJSON({ startSector: this.startSector, maxSectors: this.maxSectors })
        if (parsed) {
          console.log('NFC JSON data:', parsed)
          this.sendToRenderer('nfc-card-data', parsed)
        } else {
          console.log('NFC: no JSON payload found')
        }
      } catch (err) {
        console.error('NFC read error:', err)
      }
    })

    reader.on('card.off', () => {
      this.card = null
      console.log(`${reader.reader.name} card removed`)
      try {
        this.sendToRenderer('nfc-card-removed', { ts: new Date().toISOString() })
      } catch {}
    })

    reader.on('error', (err) => {
      console.error(`${reader.reader.name} error:`, err)
    })

    reader.on('end', () => {
      console.log(`${reader.reader.name} device removed`)
      this.active = false
      try {
        this.sendToRenderer('nfc-reader-status', { active: false })
      } catch {}
    })
  }

  sectorToBlocks(sector) {
    const base = sector * 4
    return [base + 0, base + 1, base + 2] // data blocks only; skip trailer (base+3)
  }

  async authenticateSector(blockNumber) {
    // Authenticate using Key A
    await this.reader.authenticate(blockNumber, KEY_TYPE_A, this.keyA)
  }

  async readBlocks(blockNumbers) {
    const chunks = []
    for (const block of blockNumbers) {
      await this.authenticateSector(block)
      const data = await this.reader.read(block, 16, 16) // Classic requires blockSize=16
      chunks.push(Buffer.from(data))
    }
    return Buffer.concat(chunks)
  }

  parseJsonFromBuffer(buf) {
    const start = buf.indexOf(0x7b) // '{'
    const end = buf.lastIndexOf(0x7d) // '}'
    let str
    if (start !== -1 && end !== -1 && end > start) {
      str = buf.slice(start, end + 1).toString('utf8')
    } else {
      str = buf.toString('utf8')
    }
    str = str.replace(/\u0000+$/g, '').replace(/^\ufeff/, '').trim()
    if (!str) return null
    try {
      return JSON.parse(str)
    } catch {
      return null
    }
  }

  async readClassicJSON({ startSector = 1, maxSectors = 10 } = {}) {
    if (!this.reader || !this.card) return null
    const buffers = []
    for (let s = 0; s < maxSectors; s++) {
      const sector = startSector + s
      const blocks = this.sectorToBlocks(sector)
      try {
        const data = await this.readBlocks(blocks)
        buffers.push(data)
      } catch (err) {
        // stop on auth/read error for this sector
        break
      }
      const combined = Buffer.concat(buffers)
      const parsed = this.parseJsonFromBuffer(combined)
      if (parsed) return parsed
    }
    return null
  }

  async writeClassicJSON(jsonString, { startSector = 1 } = {}) {
    if (!this.reader || !this.card) {
      return { success: false, error: 'No card present' }
    }
    const payload = typeof jsonString === 'string' ? jsonString : JSON.stringify(jsonString)
    const buf = Buffer.from(payload, 'utf8')
    const totalBlocks = Math.ceil(buf.length / 16)
    const sectorsNeeded = Math.ceil(totalBlocks / 3) // 3 data blocks per sector
    const maxUsableSectors = 16 - startSector // assume 1K card (16 sectors)
    if (sectorsNeeded > maxUsableSectors) {
      return { success: false, error: 'Payload too large for card capacity' }
    }

    const padded = Buffer.alloc(totalBlocks * 16)
    buf.copy(padded)

    let offset = 0
    for (let i = 0; i < sectorsNeeded; i++) {
      const sector = startSector + i
      const blocks = this.sectorToBlocks(sector)
      // authenticate once per sector using the first data block
      await this.authenticateSector(blocks[0])
      for (const block of blocks) {
        const slice = padded.slice(offset, offset + 16)
        await this.reader.write(block, slice, 16)
        offset += 16
        if (offset >= padded.length) break
      }
      if (offset >= padded.length) break
    }

    const verify = await this.readClassicJSON({ startSector, maxSectors: sectorsNeeded })
    const ok = verify && JSON.stringify(verify) === JSON.stringify(JSON.parse(payload))
    return { success: !!ok, verified: !!ok }
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

export default ElectronNFCHandlerNew
