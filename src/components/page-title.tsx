import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const PageTitle = ({ children, className, ...props }: { children?: ReactNode, className?: string }) => (
  <div {...props} className={cn("w-full flex items-center gap-2 font-bold text-2xl", className)}>
    {children}  
  </div>
)