import { minimalUser } from "@/auth"
import { type ClassValue, clsx } from "clsx"
import { Session } from "next-auth"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const minifyUser = ( user: Session["user"] | null ) => {
  return {
    id: user?.id,
    name: user?.name,
    username: user?.username,
    image: user?.image,
  } as minimalUser
}