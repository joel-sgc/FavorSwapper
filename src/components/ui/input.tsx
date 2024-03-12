import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

interface InputTrailingProps extends InputProps {
  trail: React.ReactNode
}

const TrailingInput = React.forwardRef<HTMLInputElement, InputTrailingProps>(
  ({ className, type, trail, ...props }, ref) => (
    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring has-[input:focus-visible]:ring-offset-2">
      <span className="font-normal font-sans text-[14px] pointer-events-none text-muted-foreground">{trail}</span>
      <input
        type={type}
        className={cn(
          "bg-transparent w-full focus-visible:!outline-none",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
)
TrailingInput.displayName = "Trailing Input"

export { Input, TrailingInput }
