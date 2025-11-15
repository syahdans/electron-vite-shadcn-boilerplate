'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

import { Badge } from '@renderer/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'

const formatCurrency = (val: number | string | undefined) => {
  const n = typeof val === 'string' ? Number(val) : val
  if (Number.isNaN(n as number) || n === undefined || n === null) return '-'
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(n as number)
  } catch {
    return `${n}`
  }
}

export const columns: ColumnDef<any, unknown>[] = [
  {
    accessorKey: 'transaction_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Transaksi ID" />,
    cell: ({ row }) => {
      const id = (row.original as any)?.transaction_id
      return <div className="min-w-[110px]">{id ?? '-'}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'effective_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Efektif" />,
    cell: ({ row }) => {
      const raw = (row.original as any)?.effective_date
      const date = raw ? moment(raw).format('ddd, D MMM YYYY') : '-'
      return (
        <div className="min-w-[140px]">
          <Badge variant="outline">
            <b>{date}</b>
          </Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
    cell: ({ row }) => {
      const desc = (row.original as any)?.description ?? '-'
      return <div className="min-w-[200px]">{desc}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Nominal" />,
    cell: ({ row }) => {
      const amount = (row.original as any)?.amount
      return <div className="min-w-[120px]">{formatCurrency(amount)}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'installment',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tenor" />,
    cell: ({ row }) => {
      const inst = (row.original as any)?.installment
      return <div className="min-w-[80px]">{inst ? `${inst}x` : '-'}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'interest_amount',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Bunga" />,
    cell: ({ row }) => {
      const bunga = (row.original as any)?.interest_amount
      return <div className="min-w-[120px]">{formatCurrency(bunga)}</div>
    },
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'last_payment_date',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Terakhir Bayar" />,
    cell: ({ row }) => {
      const raw = (row.original as any)?.last_payment_date
      const date = raw ? moment(raw).format('ddd, D MMM YYYY') : '-'

      return (
        <div className="min-w-[140px]">
          <Badge variant="outline">
            <b>{date}</b>
          </Badge>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false
  }
]
