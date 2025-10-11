import * as React from 'react'

type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'> & {
  checked?: boolean | 'indeterminate'
  onCheckedChange?: (checked: boolean) => void
}

export function Checkbox({ checked, onCheckedChange, className, ...props }: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = checked === 'indeterminate'
    }
  }, [checked])

  return (
    <input
      ref={ref}
      type="checkbox"
      className={
        'size-4 rounded border border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-50 ' +
        (className ?? '')
      }
      checked={checked === true}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  )
}

export default Checkbox

