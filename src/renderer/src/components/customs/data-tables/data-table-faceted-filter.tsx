import * as React from 'react'
import { Table } from '@tanstack/react-table'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { ChevronDown, X } from 'lucide-react'

export interface FacetedFilterOption {
  label: string
  value: string
  icon?: React.ReactNode
}

export function DataTableFacetedFilter<TData>({
  table,
  columnKey,
  title,
  options
}: {
  table: Table<TData>
  columnKey: string
  title: string
  options: FacetedFilterOption[]
}) {
  const column = table.getColumn(columnKey)
  if (!column) return null

  const selected: string[] = (column.getFilterValue() as string[]) ?? []

  function toggle(value: string) {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    const arr = Array.from(next)
    column.setFilterValue(arr.length ? arr : undefined)
  }

  function clear() {
    column.setFilterValue(undefined)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {title}
          {!!selected.length && (
            <span className="rounded bg-slate-200 px-1 text-xs">{selected.length}</span>
          )}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt.value}
            checked={selected.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
          >
            <div className="mr-2 inline-flex items-center">{opt.icon}</div>
            {opt.label}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={clear}>
          <X className="mr-2 size-4" /> Clear
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTableFacetedFilter

