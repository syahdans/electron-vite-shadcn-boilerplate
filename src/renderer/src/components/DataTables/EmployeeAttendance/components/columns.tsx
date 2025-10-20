'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@renderer/components/ui/badge'
import { Checkbox } from '@renderer/components/ui/checkbox'

import { labels, priorities, statuses } from '../data/data'
import { Task } from '../data/schema'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import moment from 'moment'

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'schedule_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal" />,
    cell: ({ row }) => {
      let date = moment(row.getValue('schedule_date')).format('D MMM YYYY')
      return (
        <div className="w-[80px]">
          <Badge variant="outline">
            <b>{date}</b>
          </Badge>
          <br />
          <span className="italic text-xs">
            {row.getValue('schedule_in')} - {row.getValue('schedule_out')}
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
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('clock_in')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'terlambat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Terlambat" />,
    cell: ({ row }) => {
      const clockIn = row.getValue('clock_in')
      const scheduleIn = row.getValue('schedule_in')

      if (!clockIn) return <div className="w-[80px] text-red-500">Tidak Absen</div>

      const diff = moment(clockIn, 'HH:mm:ss').diff(moment(scheduleIn, 'HH:mm:ss'))
      const late = diff > 0 ? moment.utc(diff).format('HH:mm:ss') : '00:00:00'

      return <div className="w-[80px]">{late}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'clock_out',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Pulang" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('clock_out')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'pulang_cepat',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Pulang Cepat" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('clock_out')}</div>,
    enableSorting: false,
    enableHiding: false
  }
]
