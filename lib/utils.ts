import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a full name to show only first and last name
 * @param fullName - The complete name
 * @returns Formatted name with first and last name only
 */
export function formatCoordinatorName(fullName: string): string {
  if (!fullName || typeof fullName !== "string") {
    return fullName || ""
  }

  const nameParts = fullName.trim().split(/\s+/)

  if (nameParts.length <= 2) {
    return fullName
  }

  // Return first and last name
  return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`
}

/**
 * Creates initials from a name (first letter of first and last name)
 * @param fullName - The complete name
 * @returns Initials string
 */
export function getInitials(fullName: string): string {
  if (!fullName || typeof fullName !== "string") {
    return "N/A"
  }

  const nameParts = fullName.trim().split(/\s+/)

  if (nameParts.length === 1) {
    return nameParts[0].substring(0, 2).toUpperCase()
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
}
