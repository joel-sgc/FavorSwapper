import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getDateDifference = ( startDate: Date, endDate: Date ) => {
  // Calculate the difference in milliseconds
  const differenceMs = endDate.getTime() - startDate.getTime();

  // Convert milliseconds to days
  const daysDifference = differenceMs / (1000 * 60 * 60 * 24);

  // Return the absolute value to handle negative differences
  return Math.abs(Math.round(daysDifference));
}