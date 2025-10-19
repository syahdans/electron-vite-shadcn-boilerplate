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
      return <div className="w-[80px]">{date}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'schedule_in',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Masuk" />,
    cell: ({ row }) => {
      return (
        <div className="w-[80px]">
          {row.getValue('schedule_in')} - {row.getValue('clock_in')}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'clock_in',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Masuk" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('clock_in')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'schedule_out',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Jam Pulang" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('schedule_out')}</div>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'clock_out',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Absen Pulang" />,
    cell: ({ row }) => <div className="w-[80px]">{row.getValue('clock_out')}</div>,
    enableSorting: false,
    enableHiding: false
  }
]
