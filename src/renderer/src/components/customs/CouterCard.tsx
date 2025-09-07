import { Card, CardContent } from '@renderer/components/ui/card'

export default function InfoItem({ label, value, children }) {
  return (
    <Card>
      <CardContent>
        <div className="grid w-full auto-rows-min gap-2 md:grid-cols-3 ">
          <div className="col-span-2 text-2xl font-bold text-gray-900 dark:text-white ">
            {value}
          </div>
          <div className="col-span-1 flex items-center justify-end ">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 p-2">
              {children}
            </div>
          </div>
          <div className="col-span-3 text-gray-500 dark:text-gray-400 ">{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
