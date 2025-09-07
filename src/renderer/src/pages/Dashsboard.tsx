import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import data from '@renderer/data.json'
import {
  Building2,
  BicepsFlexed,
  Landmark,
  MapPin,
  UserRoundPlus,
  UserRoundMinus
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import InfoItem from '@renderer/components/customs/InfoItem'
import CouterCard from '@renderer/components/customs/CouterCard'

export default function App() {
  const turnOver = data.turnOver.data.turnover

  const companyInfo = data.companyInfo.data

  const branches = data.branch.data.branches

  // const [data, setData] = useState(companyData)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <Card className="p-1">
          <CardContent className="p-1">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div> */}

      <div className="grid auto-rows-min gap-y-4 md:gap-y-0 md:gap-4 grid-cols-1 md:grid-cols-3">
        <div className="col-span-2 auto-rows-max">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Detailed Company Information and Tax</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Section 1: Company Information */}
                <div>
                  <span className="mb-2 flex items-center ">
                    <Building2 className="w-4 h-4 mr-2 text-sky-700" />
                    Company
                  </span>
                  <div className="grid gap-4 md:grid-cols-3 border rounded-lg p-4">
                    <InfoItem label="Company Name" value={companyInfo.company_name} />
                    <InfoItem label="Head Quarter" value={companyInfo.hq_initial} />
                    <InfoItem
                      label="Address"
                      value={`${companyInfo.street_address}, ${companyInfo.regency_name}, ${companyInfo.province_name} ${companyInfo.postal_code}`}
                    />
                    <InfoItem label="Phone Number" value={companyInfo.phone_number} />
                    <InfoItem
                      label="BPJS Ketenagakerjaan"
                      value={companyInfo.bpjs_ketenagakerjaan}
                    />
                  </div>
                </div>

                {/* Section 2: Tax Person */}
                <div>
                  <span className="mb-2 flex items-center ">
                    <Landmark className="w-4 h-4 mr-2 text-sky-700" />
                    Tax
                  </span>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 border rounded-lg p-4">
                    <InfoItem label="NPWP" value={companyInfo.company_npwp} />
                    <InfoItem label="Taxable Date" value={companyInfo.company_taxable_date} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Company Branch</CardTitle>
              <CardDescription>List Active Branch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {branches.map((branch) => (
                  <div className="grid gap-1 items-center rounded-lg border p-2 ">
                    <div className="flex">
                      <MapPin className="h-4 w-4 mr-1 text-sky-700" />
                      <div className="text-sm ">
                        {branch.regency_name}, {branch.province_name}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="h-4 w-4 mr-1" />
                      <div className="italic text-sm ">{branch.address}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid w-full auto-rows-min gap-4 grid-cols-2 md:grid-cols-4">
        <CouterCard value={turnOver.total_employee_active} label="Active Employee">
          <BicepsFlexed className="h-4 w-4 text-sky-700" />
        </CouterCard>
        <CouterCard value={turnOver.total_new_join} label="New Join Employee">
          <UserRoundPlus className="h-4 w-4 text-yellow-700" />
        </CouterCard>
        <CouterCard value={turnOver.total_resign} label="Total Resign Employee">
          <UserRoundMinus className="h-4 w-4 text-rose-700" />
        </CouterCard>
        <CouterCard
          value={turnOver.total_employee_active_last_year}
          label="Active Employee Last Year"
        >
          <BicepsFlexed className="h-4 w-4 text-indigo-700" />
        </CouterCard>
      </div>
    </div>
  )
}
