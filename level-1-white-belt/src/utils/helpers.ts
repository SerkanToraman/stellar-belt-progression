export function shortenKey(key: string): string {
  return `${key.slice(0, 6)}...${key.slice(-6)}`
}
