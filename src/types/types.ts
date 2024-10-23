import { formatDistanceToNow } from "date-fns"
import { NfdRecordResponseFull } from "@/lib/nfd-swagger-codegen"

export type Listing = {
  timestamp: bigint // 8 bytes
  vouchAmount: bigint // 8 bytes
  nfdAppID: bigint // 8 bytes
  tags: Uint8Array // 13 bytes, each representing one of 255 possible tags
  name: string // NFD names are up to 27 characters
} // 64 bytes total

export type DisplayedListing = {
  nfdAppID: bigint
  name: string
  amount: string
  timestamp: string
  tags: string[]
}

export class ListingPreview {
  private _timestamp: bigint
  private _vouchAmount: bigint
  private _nfdAppID: bigint
  private _tags: Uint8Array
  private _name: string

  constructor(listing: Listing) {
    this._timestamp = listing.timestamp
    this._vouchAmount = listing.vouchAmount
    this._nfdAppID = listing.nfdAppID
    this._tags = listing.tags
    this._name = listing.name
  }

  get age(): string {
    // Convert the Unix timestamp to milliseconds
    const date = new Date(Number(this._timestamp) * 1000)
    // Use formatDistanceToNow to get the relative time
    return formatDistanceToNow(date, { addSuffix: true })
  }

  get vouchAmount(): number {
    const formattedVouchAmount = microAlgo(this._vouchAmount).algo
    return formattedVouchAmount
  }

  get nfdAppID(): bigint {
    return this._nfdAppID
  }

  // TODO: Convert the array of bytes into an array of tags from a tag list
  get tags(): Uint8Array {
    return this._tags
  }

  get name(): string {
    return this._name
  }
}

export class ListingDetails {
  private _address: string
  private _avatar: string
  private _banner: string
  private _bio: string
  private _discord: string
  private _email: string
  private _github: string
  private _linkedin: string
  private _name: string
  private _nfdName: string
  private _owner: string // not for display but for management
  private _telegram: string
  private _twitter: string
  private _website: string

  constructor(nfd: NfdRecordResponseFull) {
    this._address = nfd?.properties?.userDefined?.address ?? ""
    this._avatar = nfd?.properties?.userDefined?.avatar ?? ""
    this._banner = nfd?.properties?.userDefined?.banner ?? ""
    this._bio = nfd?.properties?.userDefined?.bio ?? ""
    this._discord = nfd?.properties?.userDefined?.discord ?? ""
    this._email = nfd?.properties?.userDefined?.email ?? ""
    this._github = nfd?.properties?.userDefined?.github ?? ""
    this._linkedin = nfd?.properties?.userDefined?.linkedin ?? ""
    this._name = nfd?.properties?.userDefined?.name ?? ""
    this._nfdName = nfd?.name.split(".")[0] ?? ""
    this._owner = nfd?.owner ?? ""
    this._telegram = nfd?.properties?.userDefined?.telegram ?? ""
    this._twitter = nfd?.properties?.userDefined?.twitter ?? ""
    this._website = nfd?.properties?.userDefined?.website ?? ""
  }
}
