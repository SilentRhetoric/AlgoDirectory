/*
This file contains the logic to call the NFD API in two ways:
  1. Get the properties for a given segment of directory.algo
  2. Get the list of directory.algo segments owned by an address
*/

import { cache } from "@solidjs/router"
import { NfdRecordResponseFull, NfdV2SearchRecords } from "@/lib/nfd-swagger-codegen"

// Configure the site via env vars to use mainnet/testnet and the right app ID
const NETWORK = import.meta.env.VITE_NETWORK
const NFD_PARENT_APP_ID = Number(import.meta.env.VITE_NFD_PARENT_APP_ID)

export const nfdSiteUrlRoot = import.meta.env.VITE_NETWORK === "mainnet" ? "" : "testnet."

const nfdApiUrlRoot = () => {
  switch (NETWORK) {
    case "mainnet":
      return "api.nf.domains"
    case "testnet":
      return "api.testnet.nf.domains"
    default:
      throw new Error(`Unsupported network: ${NETWORK}`)
  }
}

const segmentInfoUrl = (name: string) =>
  `https://${nfdApiUrlRoot()}/nfd/${name}.directory.algo?view=full&poll=false&nocache=true`

async function fetchNFDInfo(name: string) {
  const url = segmentInfoUrl(name)
  try {
    const response = await fetch(url)
    const text = await response.text()
    try {
      if (text === null) {
        return { error: "Not found" }
      }
      const nfdInfo = JSON.parse(text)
      // console.debug("nfdInfo:", nfdInfo)
      return nfdInfo
    } catch (e) {
      console.error(`Errorr ${e} received from API: ${text}`)
      return { error: e }
    }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

export const getNFDInfo = cache(async (name: string): Promise<NfdRecordResponseFull> => {
  "use server" // NOTE: This runs on the server
  return fetchNFDInfo(name)
}, "getNfd")

const ownedSegmentsUrl = (address: string) =>
  `https://${nfdApiUrlRoot()}/nfd/v2/search?parentAppID=${NFD_PARENT_APP_ID}&owner=${address}&limit=200&offset=0&sort=createdDesc&view=full`

async function fetchOwnedSegments(address: string) {
  const url = ownedSegmentsUrl(address)
  try {
    const response = await fetch(url)
    const text = await response.text()
    try {
      if (text === null) {
        return { error: "Not found" }
      }
      const ownedSegmentsInfo = JSON.parse(text)
      // console.debug("ownedSegmentsInfo:", ownedSegmentsInfo)
      return ownedSegmentsInfo
    } catch (e) {
      console.error(`Error ${e} received from API: ${text}`)
      return { error: e }
    }
  } catch (error) {
    console.error(`Other error: ${error}`)
    return { error }
  }
}

export const getOwnedSegments = async (address: string): Promise<NfdV2SearchRecords> => {
  return fetchOwnedSegments(address)
}
