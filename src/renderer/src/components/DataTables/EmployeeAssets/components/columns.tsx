'use client'

import { ColumnDef } from '@tanstack/react-table'
import moment from 'moment'

import { Badge } from '@renderer/components/ui/badge'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns: ColumnDef<any, unknown>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Nama Aset" />,
        cell: ({ row }) => {
            const name = (row.original as any)?.name
            return <div className="min-w-[130px]">{name ?? '-'}</div>
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'serial_number',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Serial Number" />,
        cell: ({ row }) => {
            const sn = (row.original as any)?.serial_number
            return <div className="min-w-[120px]">{sn ?? '-'}</div>
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'category_name',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Kategori" />,
        cell: ({ row }) => {
            const cat = (row.original as any)?.category_name
            return <div className="min-w-[120px]">{cat ?? '-'}</div>
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'description',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deskripsi" />,
        cell: ({ row }) => {
            const desc = (row.original as any)?.description || '-'
            return <div className="min-w-[150px]">{desc}</div>
        },
        enableSorting: false,
        enableHiding: false
    },
    {
        accessorKey: 'assign_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Assign" />,
        cell: ({ row }) => {
            const raw = (row.original as any)?.assign_date
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
        accessorKey: 'return_date',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Tanggal Kembali" />,
        cell: ({ row }) => {
            const raw = (row.original as any)?.return_date
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
        id: 'status',
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const canReturn = (row.original as any)?.can_return
            return (
                <div className="min-w-[100px]">
                    {canReturn ? (
                        <Badge variant="default">Digunakan</Badge>
                    ) : (
                        <Badge variant="secondary">Dikembalikan</Badge>
                    )}
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false
    }
]
