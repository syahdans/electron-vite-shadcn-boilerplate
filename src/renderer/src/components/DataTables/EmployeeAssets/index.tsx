import { columns } from './components/columns'
import { DataTable } from './components/data-table'

export default function EmployeeAssetsTable({ data }) {
    console.log(data)

    return <DataTable data={data} columns={columns} />
}
