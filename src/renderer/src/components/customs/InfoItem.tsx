export default function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col ">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold text-gray-900 dark:text-gray-200 break-words">
        {value}
        </div>
    </div>
  )
}
