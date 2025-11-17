import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Toaster } from '@renderer/components/ui/sonner'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'

export default function App() {
  const [nfcActive, setNfcActive] = useState(false)
  const [writing, setWriting] = useState(false)
  const [value, setValue] = useState('')
  const [nfcTapped, setNfcTapped] = useState(false)
  const [cardData, setCardData] = useState<any | null>(null)
  const [cardUid, setCardUid] = useState<string | null>(null)

  useEffect(() => {
    const offReader = window.api?.onNfcReaderStatus?.((p: any) => setNfcActive(!!p?.active))
    const offTap = window.api?.onNfcCardTap?.((p: any) => {
      setNfcTapped(true)
      setCardUid(p?.uid || null)
      setTimeout(() => setNfcTapped(false), 1500)
    })
    const offRemoved = window.api?.onNfcCardRemoved?.(() => {
      setCardUid(null)
    })
    const offData = window.api?.onNfcCardData?.((payload: any) => {
      setCardData(payload || null)
    })
    window.api
      ?.getNfcStatus?.()
      .then((s: any) => setNfcActive(!!s?.active))
      .catch(() => {})
    return () => {
      if (typeof offReader === 'function') offReader()
      if (typeof offTap === 'function') offTap()
      if (typeof offRemoved === 'function') offRemoved()
      if (typeof offData === 'function') offData()
    }
  }, [])

  const handleWrite = async () => {
    const id = value.trim()
    if (!id) {
      toast.error('Masukkan ID terlebih dahulu')
      return
    }
    setWriting(true)
    try {
      const payload = { id }
      const res = await window.api.writeNfc(JSON.stringify(payload))
      if (res?.success) {
        toast.success('Berhasil menulis ke kartu NFC')
      } else {
        toast.error(res?.error || 'Gagal menulis ke kartu NFC')
      }
    } catch (e: any) {
      toast.error(e?.message || 'Terjadi kesalahan saat menulis')
    } finally {
      setWriting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Toaster position="top-right" richColors />
      <Card>
        <CardHeader>
          <CardTitle>NFC</CardTitle>
          <CardDescription>Pengaturan NFC</CardDescription>
          <CardAction>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${nfcActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}
                ></span>
                <span>Reader</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${nfcTapped ? 'bg-rose-500 animate-ping' : 'bg-gray-300'}`}
                ></span>
                <span>Kartu</span>
              </div>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <Input
                placeholder="Masukkan ID kartu, contoh PK.S.003"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleWrite()
                }}
              />
            </div>
            <div className="sm:col-span-1">
              <Button className="w-full" disabled={writing} onClick={handleWrite}>
                {writing ? 'Menulis...' : 'Write'}
              </Button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="border rounded p-2 text-xs">
              <div className="font-semibold mb-1">Status Kartu</div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">UID:</span>
                <span className="font-mono break-all">{cardUid || '-'}</span>
              </div>
            </div>
            <div className="border rounded p-2 text-xs">
              <div className="font-semibold mb-1">Data Kartu Saat Ini</div>
              <pre className="whitespace-pre-wrap break-all font-mono text-[11px]">
                {cardData ? JSON.stringify(cardData, null, 2) : 'Belum ada data'}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
