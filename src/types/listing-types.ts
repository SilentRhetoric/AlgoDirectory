export type Listing = {
  timestamp: bigint // 8 bytes
  vouchAmount: bigint // 8 bytes
  nfdAppID: bigint // 8 bytes
  tags: Uint8Array // 13 bytes, each representing one of 255 possible tags
  name: string // NFD names are up to 27 characters
} // 64 bytes total

export interface ListingDetails {
  address: string
  avatar: string
  banner: string
  bio: string
  discord: string
  domain: string
  email: string
  name: string
  owner: string
  telegram: string
  twitter: string
  url: string
  website: string
}
