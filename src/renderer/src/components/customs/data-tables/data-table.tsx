import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table as RTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@renderer/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@renderer/components/ui/select'
import { Checkbox } from './Checkbox'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  caption?: string
  filterColumn?: string | string[]
  filterPlaceholder?: string
  pageSizeOptions?: number[]
  toolbar?: (table: RTable<TData>) => React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  caption,
  filterColumn,
  filterPlaceholder,
  pageSizeOptions = [5, 10, 15],
  toolbar
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({ pageIndex: 0, pageSize: pageSizeOptions[0] ?? 5 })
  const [globalFilter, setGlobalFilter] = React.useState('')

  const filterColsIds = React.useMemo<string[]>(() => {
    if (!filterColumn) return []
    return Array.isArray(filterColumn) ? filterColumn : [filterColumn]
  }, [filterColumn])

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, rowSelection, pagination, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, value) => {
      const query = String(value ?? '').toLowerCase()
      if (!query) return true
      if (!filterColsIds.length) return true
      return filterColsIds.some((id) => {
        const cell = row.getValue(id as any)
        if (cell == null) return false
        return String(cell).toLowerCase().includes(query)
      })
    }
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-2">
        {filterColsIds.length ? (
          <Input
            placeholder={filterPlaceholder ?? 'Filter...'}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        ) : null}
        <div className="ml-auto">{toolbar?.(table)}</div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          {caption ? <TableCaption>{caption}</TableCaption> : null}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-2">
        <div className="text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} selected.
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select
            value={String(pagination.pageSize)}
            onValueChange={(value) => setPagination({ pageIndex: 0, pageSize: Number(value) })}
          >
            <SelectTrigger size="sm" className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataTable

