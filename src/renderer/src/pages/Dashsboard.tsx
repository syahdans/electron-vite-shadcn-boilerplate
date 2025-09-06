import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import data from '@renderer/data.json'

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'

const BuildingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9.5 14.5v-3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v3.5" />
    <line x1="12" x2="12" y1="18" y2="10" />
    <line x1="8" x2="8" y1="22" y2="20" />
    <line x1="16" x2="16" y1="22" y2="20" />
    <line x1="10" x2="10" y1="6" y2="2" />
    <line x1="14" x2="14" y1="6" y2="2" />
  </svg>
)

// MapPin icon from lucide-react
const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

// Mail icon from lucide-react
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)

// Phone icon from lucide-react
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2h-1.63a1.99 1.99 0 0 1-1.63-1.63a4.99 4.99 0 0 0-4.54-4.54a4.99 4.99 0 0 0-4.54-4.54a1.99 1.99 0 0 1-1.63-1.63V4.18a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2a1.99 1.99 0 0 0 1.63 1.63a4.99 4.99 0 0 1 4.54 4.54a1.99 1.99 0 0 1 1.63 1.63z" />
  </svg>
)

// Tax icon from lucide-react
const TaxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <circle cx="8" cy="8" r="6" />
    <path d="M12.5 12.5L16 16" />
    <path d="M16 12L12 16" />
  </svg>
)

// Calendar icon from lucide-react
const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400"
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col space-y-1 rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
    <div className="text-sm font-semibold text-gray-900 dark:text-gray-200 break-words">
      {value}
    </div>
  </div>
)

export default function App() {
  const turnOver = data.turnOver.data.turnover

  const companyInfo = data.companyInfo.data

  // const [data, setData] = useState(companyData)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="2025">2025</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid auto-rows-min gap-4 md:grid-cols-4">
        <div className="bg-muted/50 aspect-video rounded-xl">{turnOver.total_employee_active}</div>
        <div className="bg-muted/50 aspect-video rounded-xl">{turnOver.total_new_join}</div>
        <div className="bg-muted/50 aspect-video rounded-xl">{turnOver.total_resign}</div>
        <div className="bg-muted/50 aspect-video rounded-xl">
          {turnOver.total_employee_active_last_year}
        </div>
      </div>

      {/* company info */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Detailed Company Information and Tax</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Section 1: Company Information */}
              <div>
                <span className="mb-4 flex items-center ">
                  {/* <BuildingIcon /> */}
                  Company
                </span>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem label="Company Name" value={companyInfo.company_name} />
                  <InfoItem label="HQ Initial" value={companyInfo.hq_initial} />
                  <InfoItem
                    label="Address"
                    value={`${companyInfo.street_address}, ${companyInfo.regency_name}, ${companyInfo.province_name} ${companyInfo.postal_code}`}
                  />
                  <InfoItem label="Email" value={companyInfo.email_address} />
                  <InfoItem label="Phone Number" value={companyInfo.phone_number} />
                  <InfoItem label="BPJS Ketenagakerjaan" value={companyInfo.bpjs_ketenagakerjaan} />
                </div>
              </div>

              {/* Section 2: Tax Person */}
              <div>
                <span className="mb-4 flex items-center ">
                  {/* <UserIcon /> */}
                  Tax
                </span>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem label="Tax Person Name" value={companyInfo.tax_person_name} />
                  <InfoItem label="Tax Person NPWP" value={companyInfo.tax_person_npwp} />
                  <InfoItem label="NPWP" value={companyInfo.company_npwp} />
                  <InfoItem label="Taxable Date" value={companyInfo.company_taxable_date} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  )
}
