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
import { ABIType } from "algosdk"
import { Listing } from "@/types/types"

// TODO: Use netlify.toml to set something so that this will query the
// mainnet API when deployed on Netlify and otherwise default to testnet

const algorand = AlgorandClient.testNet()

const typedClient = algorand.client.getTypedAppClientById(AlgoDirectoryClient, {
  appId: BigInt(723090110), // Silent: appId 722603330 - Tako: appId 723090110
})

function boxNamesToListings(boxNames: BoxName[]): Listing[] {
  const listingKeyCodecString = "(uint64,uint64,uint64,byte[13],string)"
  const listingKeyCodec = ABIType.from(listingKeyCodecString)

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

async function fetchListings(): Promise<Listing[]> {
  try {
    const boxes = await typedClient.appClient.getBoxNames()
    console.debug("boxes", boxes)
    return boxNamesToListings(boxes)
  } catch (error) {
    console.error("Error fetching boxes", error)
    return []
  }
}

export const getListings = cache(async (): Promise<Listing[]> => {
  "use server"
  return fetchListings()
}, "getListings")
