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
import { EmployeeLoan as LoanTable } from '@renderer/components/DataTables'

import user from '@renderer/assets/images/user.png'
import data from '@renderer/data.json'
import dataEmployee from '@renderer/employee.json'
import api from '@renderer/api/api.json'
import { toast } from 'sonner'
import { Toaster } from '@renderer/components/ui/sonner'

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
  const initialLoan = {
    total: 0,
    loan: []
  }

  const [employeeId, setEmployeeId] = useState<string | null>(null)
  const [period, setPeriod] = useState<string>(moment().format('MMMM, YYYY'))
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
        return initialEmployee
      }

      return res.data.employee
    }
  })

  const employee = employeeQuery.data
  const personal = employee.personal
  const employment = employee.employment

  const cutiTahunanQuery = useQuery({
    queryKey: ['cuti-tahunan', employee?.user_id],
    enabled: employee?.user_id != null,
    queryFn: async () => {
      const qs = new URLSearchParams({
        user_id: employee.user_id
      })
      const path = `${api['cuti-tahunan']}?${qs.toString()}`
      const res = await window.api.requestTalenta('GET', `${path}`)

      if (!res.ok) {
        toast.error(res.error)
        return null
      }

      const policy = res.data.policies.find((e) => e.policy_name === 'Cuti Tahunan') ?? null

      return policy
    }
  })

  const cutiTahunan = cutiTahunanQuery.data

  const bpjsInfoQuery = useQuery({
    queryKey: ['bpjs-info', employee?.user_id],
    enabled: employee?.user_id != null,
    queryFn: async () => {
      const qs = new URLSearchParams({
        user_id: employee.user_id
      })
      const path = `${api['bpjs-info']}?${qs.toString()}`
      const res = await window.api.requestTalenta('GET', `${path}`)

      if (!res.ok) {
        toast.error(res.error)
        return null
      }

      return res.data.payroll_info
    }
  })

  const bpjsInfo = bpjsInfoQuery.data

  const attendanceSummaryQuery = useQuery({
    queryKey: ['attendance-summary', employee?.user_id, period],
    enabled: !!employee?.user_id && !!period,
    initialData: initialAttendanceSummary,
    queryFn: async () => {
      if (!employee?.user_id) return initialAttendanceSummary

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

      if (!res.ok) {
        toast.error(res.error)
        return initialAttendanceSummary
      }

      const list = res?.data?.summary_attendance_report || []

      let absence = 0
      let lateClockin = 0
      let earlyCheckout = 0
      let noCheckin = 0
      let noCheckout = 0

      for (const it of list) {
        const date = it.schedule_date
        const schedIn = moment(`${date} ${it.schedule_in}`, 'YYYY-MM-DD HH:mm:ss')
        const schedOut = moment(`${date} ${it.schedule_out}`, 'YYYY-MM-DD HH:mm:ss')
        const hasIn = !!it.clock_in
        const hasOut = !!it.clock_out

        if (!hasIn) noCheckin++
        if (!hasOut) noCheckout++

        if (!hasIn && !hasOut && !it.holiday && !it.timeoff_id) absence++

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
        list_of_attendance: list,
        absence: absence,
        late_clockin: lateClockin,
        early_clockout: earlyCheckout,
        no_checkin: noCheckin,
        no_checkout: noCheckout
      }
    }
  })

  const loanQuery = useQuery({
    queryKey: ['loan', employee?.user_id],
    enabled: employee?.user_id != null,
    initialData: initialLoan,
    queryFn: async () => {
      if (!employee?.user_id) return initialLoan

      const qs = new URLSearchParams({
        transaction_ids: employee.user_id,
        limit: '100'
      })
      const path = `${api['loans']}?${qs.toString()}`
      const res = await window.api.requestTalenta('GET', `${path}`)

      if (!res.ok) {
        toast.error(res.error)
        return initialLoan
      }

      let loan = { total: res.data.total, loans: res.data.loans ?? [] }

      return loan
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
              <p>
                <span className="font-semibold">Sisa Cuti:</span> {cutiTahunan?.total || 0} Hari
              </p>
              <p>
                <span className="font-semibold">Agama:</span> {personal.religion}
              </p>
              <p>
                <span className="font-semibold">Status Pernikahan:</span> {personal.marital_status}
              </p>
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
                {moment(employment.join_date).format('LL')}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {employment.status} (
                {employment.employment_status})
              </p>
              <p>
                <span className="font-semibold">Akhir Kontrak: </span>
                {moment(employment.end_date).format('LL')}
              </p>
              <p>
                <span className="font-semibold">Lama Mengabdi:</span> {employment.length_of_service}
              </p>
              <p>
                <span className="font-semibold">BPJS TK:</span>{' '}
                {bpjsInfo?.bpjs_ketenagakerjaan || ''}
              </p>
              <p>
                <span className="font-semibold">BPJS Kesehatan:</span>{' '}
                {bpjsInfo?.bpjs_kesehatan || ''}
              </p>
              <p>
                <span className="font-semibold">Golongan PTKP:</span> {bpjsInfo?.ptkp_status || ''}
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
          <div className="grid gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2 border rounded">
              {attendanceSummaryQuery.isFetching ? (
                <>
                  <Skeleton className="p-2 rounded bg-cyan-500/25">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Hadir</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-cyan-500/25">
                    <Spinner className="my-2" />
                    <p className="text-xs">Datang Terlambat</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-cyan-500/25">
                    <Spinner className="my-2" />
                    <p className="text-xs">Pulang Cepat</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-cyan-500/25">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Check in</p>
                  </Skeleton>
                  <Skeleton className="p-2 rounded bg-cyan-500/25">
                    <Spinner className="my-2" />
                    <p className="text-xs">Tidak Check out</p>
                  </Skeleton>
                </>
              ) : (
                <>
                  <div className="p-2 rounded bg-cyan-500/25">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.absence}</b>
                    </div>
                    <p className="text-xs">Tidak Hadir</p>
                  </div>
                  <div className="p-2 rounded bg-cyan-500/25">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.late_clockin}</b>
                    </div>
                    <p className="text-xs">Datang Terlambat</p>
                  </div>
                  <div className="p-2 rounded bg-cyan-500/25">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.early_clockout}</b>
                    </div>
                    <p className="text-xs">Pulang Cepat</p>
                  </div>
                  <div className="p-2 rounded bg-cyan-500/25">
                    <div className="my-1">
                      <b>{attendanceSummaryQuery.data.no_checkin}</b>
                    </div>
                    <p className="text-xs">Tidak Check in</p>
                  </div>
                  <div className="p-2 rounded bg-cyan-500/25">
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

      {/* Card 3 - Loan/Pinjaman */}
      <Card>
        <CardHeader>
          <CardTitle>Pinjaman</CardTitle>
          <CardDescription>Rincian Data Pinjaman Karyawan</CardDescription>
        </CardHeader>
        <CardContent>
          <LoanTable data={loanQuery.data.loans ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
