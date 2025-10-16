import moment from 'moment'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
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
  const [employee, setEmployee] = useState(data.employee.data.employee)
  const queryRef = useRef('')
  const personal = employee.personal
  const employment = employee.employment

  const [summary, setSummary] = useState({
    absence: 0,
    late_clockin: 0,
    early_clockout: 0,
    no_checkin: 0,
    no_checkout: 0
  })

  const periods = Array.from({ length: 10 }, (_, i) => {
    const m = moment().subtract(i, 'months')
    return { value: m.format('YYYY-MM'), label: m.format('MMMM YYYY') }
  })

  async function handlePeriodChange(period: string) {
    const start_date = moment(period, 'YYYY-MM').startOf('month').format('YYYY-MM-DD')
    const end_date = moment(period, 'YYYY-MM').endOf('month').format('YYYY-MM-DD')
    const employee_id = employment.employee_id

    const baseUrl = 'http://localhost:3000/attendance'
    const qs = new URLSearchParams({ start_date, end_date })

    let list = []
    try {
      const res = await fetch(`${baseUrl}?${qs.toString()}`)
      const json = await res.json()
      const remote = json?.data?.summary_attendance_report || []
      list = remote
    } catch {
      list = []
    }

    const inRange = list.filter((it) => {
      if (it.employee_id !== employee_id) return false
      const d = it.schedule_date
      return d >= start_date && d <= end_date
    })

    let absence = 0
    let lateClockin = 0
    let earlyCheckout = 0
    let noCheckin = 0
    let noCheckout = 0

    for (const it of inRange) {
      const date = it.schedule_date
      const schedIn = moment(`${date} ${it.schedule_in}`, 'YYYY-MM-DD HH:mm:ss')
      const schedOut = moment(`${date} ${it.schedule_out}`, 'YYYY-MM-DD HH:mm:ss')
      const hasIn = !!it.clock_in
      const hasOut = !!it.clock_out

      if (!hasIn) noCheckin++
      if (!hasOut) noCheckout++
      if (!hasIn && !hasOut && !it.holiday && !it.timeoff_code) absence++

      if (hasIn) {
        const clkIn = moment(`${date} ${it.clock_in}`, 'YYYY-MM-DD HH:mm:ss')
        if (clkIn.isAfter(schedIn)) lateClockin++
      }
      if (hasOut) {
        const clkOut = moment(`${date} ${it.clock_out}`, 'YYYY-MM-DD HH:mm:ss')
        if (clkOut.isBefore(schedOut)) earlyCheckout++
      }
    }

    setSummary({
      absence,
      late_clockin: lateClockin,
      early_clockout: earlyCheckout,
      no_checkin: noCheckin,
      no_checkout: noCheckout
    })
  }

  async function findEmployee(employee_id: string) {
    if (!employee_id) return
    const url = `http://localhost:3000/employee?data.employee.user_id=${employee_id}`
    try {
      const res = await fetch(url)
      const json = await res.json()
      const emp = json?.data?.employee
      if (emp) {
        setEmployee(emp)
        const current = moment().format('YYYY-MM')
        handlePeriodChange(current)
      }
    } catch {
      // ignore errors and keep existing employee data
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* searching button */}
      <Card className="p-2">
        <CardContent className="p-2">
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input
              placeholder="Nomor Induk Karyawan"
              onChange={(e) => (queryRef.current = e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => findEmployee(queryRef.current.trim())}
            >
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
            <Select onValueChange={handlePeriodChange}>
              <SelectTrigger>
                <SelectValue placeholder="month, year" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <div className="grid gap-2 grid-cols-5 p-2 border rounded">
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>{summary.absence}</b>
                </p>
                <p className="text-xs">Tidak Hadir</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>{summary.late_clockin}</b>
                </p>
                <p className="text-xs">Datang Terlambat</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>{summary.early_clockout}</b>
                </p>
                <p className="text-xs">Pulang Cepat</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>{summary.no_checkin}</b>
                </p>
                <p className="text-xs">Tidak Check in</p>
              </div>
              <div className="p-2 rounded bg-rose-100">
                <p>
                  <b>{summary.no_checkout}</b>
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
