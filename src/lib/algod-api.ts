/*
This file contains the logic to call the Algod API in two ways:
  1. To get the list of boxes for the Directory smart contract. This list contains two 
  types of boxes:
    a. Boxes keyed to the NFD segment App IDs
    b. Boxes keyed to the directory listings as the Listing struct
  2. To get the value of an individual box by its key to enrich the listing with
  its owner address so that listing management functions can be used
*/

import { cache } from "@solidjs/router"
import { AlgorandClient } from "@algorandfoundation/algokit-utils"
import { AlgoDirectoryClient } from "./AlgoDirectoryClient"
import { BoxName } from "@algorandfoundation/algokit-utils/types/app"
import { ABIType, encodeUint64 } from "algosdk"
import { Listing } from "@/types/types"

// Configure the site via env vars to use mainnet/testnet and the right app ID
export const NETWORK = import.meta.env.VITE_NETWORK
export const DIRECTORY_APP_ID = Number(import.meta.env.VITE_DIRECTORY_APP_ID)

export const algorand = () => {
  switch (NETWORK) {
    case "mainnet":
      return AlgorandClient.mainNet().setDefaultValidityWindow(100)
    case "testnet":
      return AlgorandClient.testNet().setDefaultValidityWindow(100)
    default:
      throw new Error(`Unsupported network: ${NETWORK}`)
  }
}

const typedAppClient = algorand().client.getTypedAppClientById(AlgoDirectoryClient, {
  appId: BigInt(DIRECTORY_APP_ID),
})

const listingKeyCodecString = "(uint64,uint64,uint64,byte[13],string)"
const listingKeyCodec = ABIType.from(listingKeyCodecString)

function boxNamesToListings(boxNames: BoxName[]): Listing[] {
  // There are two boxes per listing in the Directory smart contract:
  // 1. Key=AppID, Value=Listing struct
  // 2. Key=Listing struct, Value=Address of the listing owner
  // To render the listings list we only need #2
  const justListings = boxNames.reduce<Listing[]>((accumulator, box) => {
    if (box.nameRaw.length === 8) {
      return accumulator
    }

    // Cast the Listing ABI struct to a typed JS object
    const decoded = listingKeyCodec.decode(box.nameRaw)
    const [timestamp, vouchAmount, nfdAppID, tags, name] = Object.values(decoded)
    const listing: Listing = { timestamp, vouchAmount, nfdAppID, tags, name }
    console.debug("listing:", listing)
    accumulator.push(listing)

    return accumulator
  }, [])

  return justListings
}

// For fetching of the listings list
async function fetchListings(): Promise<Listing[]> {
  try {
    const boxes = await typedAppClient.appClient.getBoxNames()
    console.debug("boxes", boxes)
    return boxNamesToListings(boxes)
  } catch (error) {
    console.error("Error fetching boxes", error)
    return []
  }
}

export const getListings = cache(async (): Promise<Listing[]> => {
  "use server" // NOTE: This runs on the server
  try {
    return fetchListings()
  } catch (error: any) {
    console.error("Error fetching listings: ", error)
    return []
  }
}, "getListings")

// For fetching of individual listings
export async function fetchSingleListing(appID: number): Promise<Listing> {
  try {
    const boxNameBytes = encodeUint64(appID)
    const box = await typedAppClient.appClient.getBoxValue(boxNameBytes)
    const decoded = listingKeyCodec.decode(box)
    const [timestamp, vouchAmount, nfdAppID, tags, name] = Object.values(decoded)
    const listing: Listing = { timestamp, vouchAmount, nfdAppID, tags, name }
    return listing
  } catch (error: any) {
    console.error("Error fetching box: ", error.message)
    throw new Error(error.message)
  }
}
