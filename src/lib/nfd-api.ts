/*
This file contains the logic to call the NFD API for a given name
that is a segment of directory.algo and get its properties.
*/

import { cache } from "@solidjs/router"
import { NfdRecordResponseFull, NfdV2SearchRecords } from "@/lib/nfd-swagger-codegen"

// Configure the site via env vars to use mainnet/testnet and the right app ID
export const NETWORK = import.meta.env.VITE_NETWORK
export const APP_ID = Number(import.meta.env.VITE_APP_ID)
export const NFD_PARENT_APP_ID = Number(import.meta.env.VITE_NFD_PARENT_APP_ID)

const segmentInfoUrlRoot = () => {
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
  `https://${segmentInfoUrlRoot()}/nfd/${name}.directory.algo?view=full&poll=false&nocache=false`

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
      console.debug("nfdInfo:", nfdInfo)
      return nfdInfo
    } catch (e) {
      console.error(`Received from API: ${text}`)
      console.error(e)
      return { error: e }
    }
  } catch (error) {
    console.error(error)
    return { error }
  }
}

export const getNFDInfo = cache(async (name: string): Promise<NfdRecordResponseFull> => {
  "use server"
  return fetchNFDInfo(name)
}, "getNfd")

const ownedSegmentsUrl = (address: string) =>
  `https://${segmentInfoUrlRoot()}/nfd/v2/search?parentAppID=${NFD_PARENT_APP_ID}&owner=${address}&limit=200&offset=0&sort=createdDesc&view=thumbnail`

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
      console.debug("ownedSegmentsInfo:", ownedSegmentsInfo)
      return ownedSegmentsInfo
    } catch (e) {
      console.error(`Received from API: ${text}`)
      console.error(e)
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
