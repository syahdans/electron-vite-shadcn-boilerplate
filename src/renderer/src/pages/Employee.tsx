import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
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
      <Card className="p-2">
        <CardContent className="p-2">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input placeholder="Nomor Induk Karyawan" />
            <Button type="button" variant="outline">
              Find
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Employee</CardTitle>
          <CardDescription>Employee Profiles and Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-5">
            <div className="col-span-1 p-2 bg-slate-100">image</div>
            <div className="col-span-2 p-2 bg-rose-100">details 1</div>
            <div className="col-span-2 p-2 bg-sky-100">details 2</div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Employee Total Balance & Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid gap-2 grid-cols-5">
                <div className="col-span-1 p-2 bg-slate-100">Total</div>
              </div>
              <div className="flex p-2 bg-rose-100">tables</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Loan</CardTitle>
            <CardDescription>Employee Total Loan & Details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <div className="grid gap-2 grid-cols-5">
                <div className="col-span-1 p-2 bg-slate-100">Total</div>
              </div>
              <div className="flex p-2 bg-rose-100">tables</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Assets</CardTitle>
          <CardDescription>Employee Assigned Assets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex p-2 bg-sky-100">tables</div>
        </CardContent>
      </Card>
    </div>
  )
}
