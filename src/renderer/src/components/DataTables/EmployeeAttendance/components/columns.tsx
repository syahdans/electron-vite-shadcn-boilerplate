'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@renderer/components/ui/badge'

import { Task } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import moment from 'moment'

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'schedule_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
    cell: ({ row }) => {
      let schedule_date = (row.original as any)?.schedule_date
      let schedule_in = (row.original as any)?.schedule_in
      let schedule_out = (row.original as any)?.schedule_out

      let date = moment(schedule_date).format('ddd, D MMM YYYY')
      return (
        <div className="w-[80px]">
          <Badge variant="outline">
            <b>{date}</b>
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

      return <div className="w-[80px]">{clockIn.format('DD MMM YY, HH:mm:ss')}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'terlambat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Terlambat" />,
    cell: ({ row }) => {
      let date = (row.original as any)?.schedule_date ?? ''
      let clock_in = (row.original as any)?.clock_in ?? ''
      let schedule_in = (row.original as any)?.schedule_in ?? ''

      schedule_in = moment(`${date} ${schedule_in}`, 'YYYY-MM-DD HH:mm:ss')
      clock_in = moment(`${clock_in}`, 'YYYY-MM-DD HH:mm:ss')

      const diff = moment(clock_in, 'HH:mm:ss').diff(moment(schedule_in, 'HH:mm:ss'))
      let late = moment.utc(diff).format('HH:mm:ss')

      if (clock_in.isAfter(schedule_in)) return <div className="w-[80px] text-red-500">{late}</div>

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

      if (!clock_out) return <div className="w-[80px]">Tidak Absen</div>

      return <div className="w-[80px]">{row.getValue('clock_out')}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'pulang_cepat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pulang Cepat" />,
    cell: ({ row }) => {
      let date = (row.original as any)?.schedule_date ?? ''
      let clock_out = (row.original as any)?.clock_out ?? ''
      let schedule_out = (row.original as any)?.schedule_out ?? ''

      schedule_out = moment(`${date} ${schedule_out}`, 'YYYY-MM-DD HH:mm:ss')
      clock_out = moment(`${clock_out}`, 'YYYY-MM-DD HH:mm:ss')

      const diff = moment(schedule_out, 'HH:mm:ss').diff(moment(clock_out, 'HH:mm:ss'))
      let early = moment.utc(diff).format('HH:mm:ss')

      if (clock_out.isBefore(schedule_out))
        return <div className="w-[80px] text-red-500">{early}</div>

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

      if (!clock_out && !clock_in) return <div className="w-[80px] ">Tidak Hadir</div>

      if (!clock_in) return <div className="w-[80px] ">Tidak Absen Datang</div>

      if (!clock_out) return <div className="w-[80px] ">Tidak Absen Pulang</div>

      return <div className="w-[80px]">-</div>
    },
    enableSorting: false,
    enableHiding: false
  }
]
