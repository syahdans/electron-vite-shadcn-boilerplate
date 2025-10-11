import moment from 'moment'
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

import user from '@renderer/assets/images/user-li.jpg'
import data from '@renderer/data.json'
import { EmployeeAttendance as AttendanceTable } from '@renderer/components/DataTables'

export default function App() {
  const personal = data.employee.data.employee.personal
  const employment = data.employee.data.employee.employment

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* searching button */}
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

      {/* employee profile card */}
      <Card>
        <CardHeader>
          <CardTitle>Karyawan</CardTitle>
          <CardDescription>Profil Karyawan dan Detail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 grid-cols-7">
            <div className="col-span-1 p-2 max-h-40 border rounded">
              {/* <div className="h-full w-full rounded overflow-hidden">
                <img 
                  src={user} 
                  alt="Employee" 
                  className="w-full"
                />
              </div> */}
              <div className="bg-rose-300 w-full max-h-35 rounded overflow-hidden">
                <img src={user} alt="Employee" className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Details 1 (Personal Info) */}
            <div className="col-span-3 p-2 pl-4 border rounded">
              <p>
                <span className="font-semibold">Nama:</span> {personal.first_name}{' '}
                {personal.last_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {personal.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {personal.phone}
              </p>
              <p>
                <span className="font-semibold">Alamat:</span> {personal.address}
              </p>
              <p>
                <span className="font-semibold">Tempat Tgl Lahir:</span> {personal.birth_place},{' '}
                {moment(personal.birth_date).format('ll')}
              </p>
              <p>
                <span className="font-semibold">Sisa Cuti:</span> 0
              </p>
            </div>

            {/* Details 2 (Employment Info) */}
            <div className="col-span-3 p-2 pl-4 border rounded">
              <p>
                <span className="font-semibold">Employee ID:</span> {employment.employee_id}
              </p>
              <p>
                <span className="font-semibold">Posisi:</span> {employment.job_position}
              </p>
              <p>
                <span className="font-semibold">Departemen:</span> {employment.organization_name}
              </p>
              <p>
                <span className="font-semibold">Tanggal Bergabung:</span>{' '}
                {moment(employment.join_date).format('ll')}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {employment.status}
              </p>
              <p>
                <span className="font-semibold">Lama Mengabdi:</span> {employment.length_of_service}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* absens card */}
      <Card>
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
          <CardDescription>Rekap Absensi Karyawan dan Detail</CardDescription>
          <CardAction>
            <Input placeholder="month, year" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid gap-2 grid-cols-5 p-2 border rounded">
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>123</b>
                </p>
                <p className="text-xs">Tidak Hadir</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>123</b>
                </p>
                <p className="text-xs">Datang Terlambat</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>123</b>
                </p>
                <p className="text-xs">Pulang Cepat</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>123</b>
                </p>
                <p className="text-xs">Tidak Check in</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>123</b>
                </p>
                <p className="text-xs">Tidak Check out</p>
              </div>
            </div>
            <div className="mb-4"></div>
            <div className="grid gap-2">
              <AttendanceTable />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        {/* balance card */}
        <Card>
          <CardHeader>
            <CardTitle>Tabungan</CardTitle>
            <CardDescription>Total Tabungan dan Detail</CardDescription>
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
        {/* loan card */}
        <Card>
          <CardHeader>
            <CardTitle>Hutang</CardTitle>
            <CardDescription>Hutang Karyawan dan Detail</CardDescription>
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
      {/* assets card */}
      <Card>
        <CardHeader>
          <CardTitle>Aset</CardTitle>
          <CardDescription>Aset Karyawan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">table</div>
        </CardContent>
      </Card>
    </div>
  )
}
