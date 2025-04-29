import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(dateString: string | null): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return ""

  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ""
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ""

  return `${firstInitial}${lastInitial}`
}
