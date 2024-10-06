import { microAlgo } from "@algorandfoundation/algokit-utils"
import { formatDistanceToNow } from "date-fns"
import { NfdRecordResponseFull } from "~/lib/nfd-swagger-codegen"

export type Listing = {
  timestamp: bigint // 8 bytes
  vouchAmount: bigint // 8 bytes
  nfdAppID: bigint // 8 bytes
  tags: Uint8Array // 13 bytes, each representing one of 255 possible tags
  name: string // NFD names are up to 27 characters
} // 64 bytes total

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

// export class ListingDetails {
//   constructor(nfd: NfdRecordResponseFull) {}

//   address: string
//   avatar: string
//   banner: string
//   bio: string
//   discord: string
//   email: string
//   github: string
//   linkedin: string
//   name: string
//   nfdName: string
//   // owner: string // not for display but for management
//   telegram: string
//   twitter: string
//   website: string
// }
