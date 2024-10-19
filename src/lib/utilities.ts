export function ellipseString(string: string | null): string {
  return string ? `${string.slice(0, 3)}...${string.slice(-3)}` : ""
}
