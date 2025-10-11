import { Row } from '@tanstack/react-table'
import { Button } from '@renderer/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export function DataTableRowActions<TData>({ row }: { row: Row<TData> }) {
  function copyId() {
    const original: any = row.original as any
    const id = (original && (original.id || original.ID || original.Id)) ?? row.id
    navigator.clipboard?.writeText(String(id)).catch(() => {})
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open row actions" variant="ghost" className="size-8 p-0">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={copyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTableRowActions

