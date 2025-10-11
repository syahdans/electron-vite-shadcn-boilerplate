import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Input } from '@renderer/components/ui/input'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterColumn?: string | string[]
  placeholder?: string
  children?: React.ReactNode
}

export function DataTableToolbar<TData>({ table, filterColumn, placeholder, children }: DataTableToolbarProps<TData>) {
  const [value, setValue] = React.useState('')
  const filterColsIds = React.useMemo<string[]>(() => {
    if (!filterColumn) return []
    return Array.isArray(filterColumn) ? filterColumn : [filterColumn]
  }, [filterColumn])

  React.useEffect(() => {
    // Implement OR filter across specified columns using globalFilter
    table.setGlobalFilter(value)
  }, [value, table])

  table.setOptions((prev) => ({
    ...prev,
    globalFilterFn: (row, _columnId, filterValue) => {
      const query = String(filterValue ?? '').toLowerCase()
      if (!query) return true
      if (!filterColsIds.length) return true
      return filterColsIds.some((id) => {
        const cell = row.getValue(id as any)
        if (cell == null) return false
        return String(cell).toLowerCase().includes(query)
      })
    }
  }))

  return (
    <div className="flex items-center gap-2 py-2">
      {filterColsIds.length ? (
        <Input
          placeholder={placeholder ?? 'Filter...'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="max-w-sm"
        />
      ) : null}
      <div className="ml-auto flex items-center gap-2">{children}</div>
    </div>
  )
}

export default DataTableToolbar

