import { formatDistanceToNow } from "date-fns"

export function ellipseString(string: string | null): string {
  return string ? `${string.slice(0, 3)}...${string.slice(-3)}` : ""
}

export function formatTimestamp(timestamp: bigint | undefined) {
  if (!timestamp) {
    return ""
  }
  // Convert the Unix timestamp to milliseconds
  const date = new Date(Number(timestamp) * 1000)
  // Use formatDistanceToNow to get the relative time
  return formatDistanceToNow(date, { addSuffix: true })
}
