import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export default function EmployeeAttendanceTable({ data }) {
  return <DataTable data={data} columns={columns} />
}
