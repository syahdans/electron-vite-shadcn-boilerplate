import { ArrowDown, ArrowUp, ArrowUpDown, EyeOff } from 'lucide-react'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { Column } from '@tanstack/react-table'

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({ column, title }: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className="flex items-center gap-2">{title}</div>
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="-ml-2 h-8">
            {title}
            {column.getIsSorted() === 'desc' ? (
              <ArrowDown className="ml-2 size-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUp className="ml-2 size-4" />
            ) : (
              <ArrowUpDown className="ml-2 size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            Desc
          </DropdownMenuItem>
          {column.getCanHide() ? (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeOff className="mr-2 size-4" /> Hide
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default DataTableColumnHeader

