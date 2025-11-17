'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@renderer/components/ui/badge'

import { DataTableColumnHeader } from './data-table-column-header'
import moment from 'moment'

export const columns = [
  {
    accessorKey: 'schedule_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
    cell: ({ row }) => {
      let schedule_date = (row.original as any)?.schedule_date
      let schedule_in = (row.original as any)?.schedule_in
      let schedule_out = (row.original as any)?.schedule_out
      let holiday = (row.original as any)?.holiday ?? false

      let date = moment(schedule_date).format('ddd, D MMM YYYY')
      return (
        <div className="w-[80px]">
          <Badge variant="outline">
            {holiday ? <b className="text-red-500">{date}</b> : <b>{date}</b>}
          </Badge>
          <br />
          <span className="italic text-xs">
            {schedule_in} - {schedule_out}
          </span>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'clock_in',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Datang" />,
    cell: ({ row }) => {
      let clock_in = (row.original as any)?.clock_in ?? ''

      let clockIn = moment(`${clock_in}`, 'YYYY-MM-DD HH:mm:ss')

      if (!clock_in) return <div className="w-[80px]">Tidak Absen</div>

      return <div className="w-[80px]">{clockIn.format('HH:mm:ss')}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'terlambat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Terlambat" />,
    cell: ({ row }) => {
      let late_in = (row.original as any)?.late_in ?? ''

      let late = moment.utc(late_in * 1000 * 60).format('HH:mm:ss')

      if (late_in) return <div className="w-[80px] text-red-500">{late}</div>

      return <div className="w-[80px]">-</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'clock_out',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Pulang" />,
    cell: ({ row }) => {
      let clock_out = (row.original as any)?.clock_out ?? ''

      let clockOut = moment(`${clock_out}`, 'YYYY-MM-DD HH:mm:ss')

      if (!clock_out) return <div className="w-[80px]">Tidak Absen</div>

      return <div className="w-[80px]">{clockOut.format('HH:mm:ss')}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'pulang_cepat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pulang Cepat" />,
    cell: ({ row }) => {
      let early_out = (row.original as any)?.early_out ?? ''

      let early = moment.utc(early_out * 1000 * 60).format('HH:mm:ss')

      if (early_out) return <div className="w-[80px] text-red-500">{early}</div>

      return <div className="w-[80px]">-</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'keterangan',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Keterangan" />,
    cell: ({ row }) => {
      let clock_in = (row.original as any)?.clock_in ?? ''
      let clock_out = (row.original as any)?.clock_out ?? ''
      let holiday = (row.original as any)?.holiday ?? false

      let timeoff = (row.original as any)?.timeoff_id ?? 0
      let timeoff_name = (row.original as any)?.timeoff_name ?? ''

      if (timeoff) return <div className="w-[80px] ">{timeoff_name}</div>

      if (!clock_out && !clock_in && !holiday) return <div className="w-[80px] ">Tidak Hadir</div>

      if (!clock_in && !holiday) return <div className="w-[80px] ">Tidak Absen Datang</div>

      if (!clock_out && !holiday) return <div className="w-[80px] ">Tidak Absen Pulang</div>

      return <div className="w-[80px]">-</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'overtime',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Overtime" />,
    cell: ({ row }) => {
      let overtime = (row.original as any)?.overtime ?? ''

      let ot = moment.utc(overtime * 1000 * 60).format('HH:mm:ss')

      if (overtime) return <div className="w-[80px] text-red-500">{ot}</div>

      return <div className="w-[80px]">-</div>
    },
    enableSorting: false,
    enableHiding: false
  }
]
