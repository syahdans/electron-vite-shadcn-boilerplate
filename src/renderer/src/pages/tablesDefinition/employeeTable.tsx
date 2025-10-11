import moment from 'moment'
import { Button } from '@renderer/components/ui/button'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'

export type Attendance = {
  date: string
  ci: string
  co: string
  late: boolean
  early: boolean
  status: 'Present' | 'Absent' | 'Leave' | 'Overtime'
}

export const ATTENDANCE_DATA: Attendance[] = [
  { date: '2024-10-01', ci: '08:03', co: '17:01', late: true, early: false, status: 'Present' },
  { date: '2024-10-02', ci: '08:00', co: '17:05', late: false, early: false, status: 'Present' },
  { date: '2024-10-03', ci: '-', co: '-', late: false, early: false, status: 'Absent' },
  { date: '2024-10-04', ci: '08:12', co: '16:40', late: true, early: true, status: 'Present' },
  { date: '2024-10-05', ci: '08:05', co: '17:00', late: true, early: false, status: 'Present' },
  { date: '2024-10-06', ci: '08:00', co: '17:10', late: false, early: false, status: 'Present' },
  { date: '2024-10-07', ci: '-', co: '-', late: false, early: false, status: 'Leave' },
  { date: '2024-10-08', ci: '08:01', co: '16:55', late: false, early: true, status: 'Present' },
  { date: '2024-10-09', ci: '08:20', co: '17:20', late: true, early: false, status: 'Present' },
  { date: '2024-10-10', ci: '07:59', co: '18:30', late: false, early: false, status: 'Overtime' },
  { date: '2024-10-11', ci: '08:04', co: '17:02', late: true, early: false, status: 'Present' },
  { date: '2024-10-12', ci: '-', co: '-', late: false, early: false, status: 'Absent' },
  { date: '2024-10-13', ci: '08:00', co: '17:00', late: false, early: false, status: 'Present' }
]

export const ATTENDANCE_COLUMNS: ColumnDef<Attendance>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tanggal
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => moment(row.getValue('date') as string).format('ll'),
    enableHiding: false
  },
  {
    accessorKey: 'ci',
    header: 'Check In',
    cell: ({ row }) => String(row.getValue('ci'))
  },
  {
    accessorKey: 'co',
    header: 'Check Out',
    cell: ({ row }) => String(row.getValue('co'))
  },
  {
    accessorKey: 'late',
    header: 'Terlambat',
    cell: ({ row }) => ((row.getValue('late') as boolean) ? 'Ya' : 'Tidak')
  },
  {
    accessorKey: 'early',
    header: 'Pulang Cepat',
    cell: ({ row }) => ((row.getValue('early') as boolean) ? 'Ya' : 'Tidak')
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue('status') as string}</div>
  }
]

export type AssetTask = {
  id: string
  title: string
  status: 'todo' | 'in progress' | 'done' | 'canceled'
  label: 'bug' | 'feature' | 'documentation' | 'maintenance'
  priority: 'low' | 'medium' | 'high'
}

export const ASSET_TASKS_DATA: AssetTask[] = [
  { id: 'A-1001', title: 'Laptop Lenovo T14', status: 'in progress', label: 'maintenance', priority: 'medium' },
  { id: 'A-1002', title: 'Monitor Dell 24"', status: 'todo', label: 'feature', priority: 'low' },
  { id: 'A-1003', title: 'Keyboard Mechanical', status: 'done', label: 'maintenance', priority: 'low' },
  { id: 'A-1004', title: 'Mouse Logitech MX', status: 'in progress', label: 'maintenance', priority: 'low' },
  { id: 'A-1005', title: 'Headset Jabra', status: 'todo', label: 'feature', priority: 'medium' },
  { id: 'A-1006', title: 'Kursi Ergonomis', status: 'done', label: 'documentation', priority: 'low' },
  { id: 'A-1007', title: 'Meja Kerja', status: 'done', label: 'maintenance', priority: 'low' },
  { id: 'A-1008', title: 'HP iPhone 13', status: 'in progress', label: 'maintenance', priority: 'high' },
  { id: 'A-1009', title: 'Kamera Webcam', status: 'todo', label: 'feature', priority: 'low' },
  { id: 'A-1010', title: 'UPS APC 650VA', status: 'canceled', label: 'maintenance', priority: 'medium' },
  { id: 'A-1011', title: 'Tablet iPad', status: 'done', label: 'feature', priority: 'medium' },
  { id: 'A-1012', title: 'Printer HP LaserJet', status: 'in progress', label: 'maintenance', priority: 'high' }
]

export const ASSET_TASKS_COLUMNS: ColumnDef<AssetTask>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Item
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => String(row.getValue('title'))
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const v = String(row.getValue('status'))
      const cls =
        v === 'done'
          ? 'bg-emerald-100 text-emerald-700'
          : v === 'in progress'
            ? 'bg-blue-100 text-blue-700'
            : v === 'canceled'
              ? 'bg-rose-100 text-rose-700'
              : 'bg-slate-100 text-slate-700'
      return <span className={`px-2 py-1 rounded text-xs ${cls}`}>{v}</span>
    }
  },
  {
    accessorKey: 'label',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Label
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => String(row.getValue('label'))
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Priority
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => String(row.getValue('priority'))
  },
  {
    id: 'actions',
    header: 'Actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
]
