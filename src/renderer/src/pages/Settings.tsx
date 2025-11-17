import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'

export default function App() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan</CardTitle>
          <CardDescription>Pengaturan Aplikasi</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="italic">Comming Soon</p>
        </CardContent>
      </Card>
    </div>
  )
}
