import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import tasksJson from './data/tasks.json'
import type { Task } from './data/schema'

const tasks = tasksJson as Task[]

export default function EmployeeAttendanceTable({ data }) {
  return <DataTable data={data} columns={columns} />
}
