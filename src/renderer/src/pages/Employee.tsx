import moment from 'moment'
import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { Spinner } from '@renderer/components/ui/spinner'
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
import { EmployeeAttendance as AttendanceTable } from '@renderer/components/DataTables'

import user from '@renderer/assets/images/user.png'
import data from '@renderer/data.json'
import dataEmployee from '@renderer/employee.json'
import api from '@renderer/api/api.json'
import { toast } from 'sonner'
import { Toaster } from '@renderer/components/ui/sonner'

/*
this page will show data of emplyee based on user input
all data will fetch from multipe api endpoint

in Card 1 will show karyawan detail and image from end point getEmployee() by employee id
in Card 2 will show summary of absence and data table

task:
1. when user klick the find button, then this will trigger all API to fetch
2. when employee data is ready then set data to the Card
3. when ebsence data is ready then set data to card
*/

export default function App() {
  const initialEmployee = data.employee.data.employee
  const initialAttendanceSummary = {
    list_of_attendance: [],
    absence: 0,
    late_clockin: 0,
    early_clockout: 0,
    no_checkin: 0,
    no_checkout: 0
  }

  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [period, setPeriod] = useState<string>(moment().format('YYYY-MM'))
  const queryRef = useRef('')

  const employeeQuery = useQuery({
    queryKey: ['employee', employeeId],
    enabled: employeeId !== null,
    initialData: initialEmployee,
    queryFn: async () => {
      if (!employeeId) return initialEmployee
      const employee = dataEmployee.find(
        (e) => e.employee_id.toLowerCase() === employeeId.toLowerCase()
      )

      if (!employee) {
        toast.warning('Karyawan tidak ditemukan.')
        return initialEmployee
      }

      const path = `${api['employee-by-user-id']}/${employee?.user_id}`

      const res = await window.api.requestTalenta('GET', `${path}`)

      if (!res.ok) {
        toast.error(res.error)
      }

      return res.data.employee
    }
  })

  const employee = employeeQuery.data
  const personal = employee.personal
  const employment = employee.employment

  const attendanceSummaryQuery = useQuery({
    queryKey: ['attendance-summary', employment?.employee_id, period],
    enabled: !!employment?.employee_id && !!period,
    initialData: initialAttendanceSummary,
    queryFn: async () => {
      const start_date = moment(period, 'MMMM, YYYY').startOf('month').format('YYYY-MM-DD')
      const end_date = moment(period, 'MMMM, YYYY').endOf('month').format('YYYY-MM-DD')

      const qs = new URLSearchParams({
        date: start_date,
        end_date,
        user_ids: employee.user_id,
        limit: '150'
      })
      const path = `${api['summary-report']}?${qs.toString()}`
      const res = await window.api.requestTalenta('GET', `${path}`)
      console.log(res)

      const list = res?.data?.summary_attendance_report || []

      const inRange = list.filter((e) => e.user_id == employee.user_id)

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
          const clkIn = moment(`${it.clock_in}`, 'YYYY-MM-DD HH:mm:ss')
          if (clkIn.isAfter(schedIn)) lateClockin++
        }
        if (hasOut) {
          const clkOut = moment(`${it.clock_out}`, 'YYYY-MM-DD HH:mm:ss')
          if (clkOut.isBefore(schedOut)) earlyCheckout++
        }
      }

      return {
        list_of_attendance: inRange,
        absence: absence,
        late_clockin: lateClockin,
        early_clockout: earlyCheckout,
        no_checkin: noCheckin,
        no_checkout: noCheckout
      }
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Toaster position="top-right" richColors />
      {/* searching button */}
      <Card className="p-2">
        <CardContent className="p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 flex flex-row gap-2">
              <Input
                placeholder="Nomor Induk Karyawan"
                onChange={(e) => (queryRef.current = e.target.value)}
              />
              {employeeQuery.isFetching ? (
                <Button disabled size="sm">
                  <Spinner />
                  Finding...
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const id = queryRef.current.trim() || null

                    if (!id) return

                    employeeId === id ? employeeQuery.refetch() : setEmployeeId(id)
                  }}
                >
                  Find
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card 1 - Profil Karyawan */}
      <Card>
        <CardHeader>
          <CardTitle>Karyawan</CardTitle>
          <CardDescription>Profil Karyawan dan Detail</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
            <div className="col-span-1 md:col-span-1 p-2 max-h-40 border rounded">
              <div className="bg-rose-300 w-full max-h-35 rounded overflow-hidden">
                <img
                  src={personal.avatar || user}
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* Details 1 (Personal Info) */}
            <div className="col-span-1 md:col-span-3 p-2 pl-4 border rounded">
              <p>
                <span className="font-semibold">Nama:</span> {personal.first_name}{' '}
                {personal.last_name}
              </p>
              <p>
                <span className="font-semibold">Email:</span> {personal.email}
              </p>
              <p>
                <span className="font-semibold">Phone:</span> {personal.mobile_phone}
              </p>
              <p>
                <span className="font-semibold">Alamat:</span> {personal.address}
              </p>
              <p>
                <span className="font-semibold">Tempat Tgl Lahir:</span> {personal.birth_place},{' '}
                {moment(personal.birth_date).format('ll')}
              </p>
              <p>{/* <span className="font-semibold">Sisa Cuti:</span> 0 */}</p>
            </div>

            {/* Details 2 (Employment Info) */}
            <div className="col-span-1 md:col-span-3 p-2 pl-4 border rounded">
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

      {/* Card 2 - Absen */}
      <Card>
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
          <CardDescription>Rekap Absensi Karyawan dan Detail</CardDescription>
          <CardAction>
            <Select onValueChange={setPeriod} defaultValue={moment().format('MMMM, YYYY')}>
              <SelectTrigger>
                <SelectValue placeholder="month, year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) =>
                  moment().subtract(i, 'months').format('MMMM, YYYY')
                ).map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2 border rounded">
              {attendanceSummaryQuery.isFetching ? (
                <>
                  <Skeleton className="p-2 rounded bg-green-100">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Hadir</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-green-100">
                    <Spinner className="my-2" />
                    <p className="text-xs">Datang Terlambat</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-green-100">
                    <Spinner className="my-2" />
                    <p className="text-xs">Pulang Cepat</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-green-100">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Check in</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-green-100">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Check out</p>
                  </Skeleton>
                </>
              ) : (
                <>
                  <div className="p-2 rounded bg-green-100">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.absence}</b>
                    </div>
                    <p className="text-xs">Tidak Hadir</p>
                  </div>
                  <div className="p-2 rounded bg-green-100">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.late_clockin}</b>
                    </div>
                    <p className="text-xs">Datang Terlambat</p>
                  </div>
                  <div className="p-2 rounded bg-green-100">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.early_clockout}</b>
                    </div>
                    <p className="text-xs">Pulang Cepat</p>
                  </div>
                  <div className="p-2 rounded bg-green-100">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.no_checkin}</b>
                    </div>
                    <p className="text-xs">Tidak Check in</p>
                  </div>
                  <div className="p-2 rounded bg-green-100">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.no_checkout}</b>
                    </div>
                    <p className="text-xs">Tidak Check out</p>
                  </div>
                </>
              )}
            </div>
            <AttendanceTable data={attendanceSummaryQuery.data.list_of_attendance} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
