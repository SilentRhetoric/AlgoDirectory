/*
This file contains the logic to call the NFD API in two ways:
  1. Get the properties for a given segment of directory.algo
  2. Get the list of directory.algo segments owned by an address
*/

import { cache } from "@solidjs/router"
import { NfdRecordResponseFull, NfdV2SearchRecords } from "@/lib/nfd-swagger-codegen"
import { fetchBlueskyHandle } from "./bsky-api"
import { fetchDiscordUser } from "./discord-api"
import { getUserHandleFromID } from "./telegram-api"

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
  console.debug(`fetchNFDInfo: ${url}`)
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
      console.debug("ownedSegmentsInfo:", ownedSegmentsInfo)
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

export type NFDDisplayFields = {
  segmentFullName: string
  segmentName: string
  state?: string
  avatar?: string
  banner?: string
  name?: string
  bio?: string
  website?: string
  email?: string
  emailVerified: boolean
  address?: string
  github?: string
  githubVerified: boolean
  githubUrl?: string
  bluesky?: string
  blueskyVerified: boolean
  twitter?: string
  twitterVerified: boolean
  twitterUrl?: string
  discord?: string
  discordVerified: boolean
  discordUrl?: string
  telegram?: string
  telegramVerified: boolean
  telegramUrl?: string
  linkedin?: string
}

async function prepareNFDInfo(nfdInfo: NfdRecordResponseFull) {
  "use server" // NOTE: This runs on the server
  let preparedInfo = {} as NFDDisplayFields
  preparedInfo.segmentFullName = nfdInfo.name
  preparedInfo.segmentName = nfdInfo.name.split(".")[0]
  preparedInfo.state = nfdInfo.state?.toString()
  preparedInfo.avatar =
    nfdInfo?.properties?.verified?.avatar?.replace("ipfs://", "https://images.nf.domains/ipfs/") ??
    nfdInfo?.properties?.userDefined?.avatar
  preparedInfo.banner =
    nfdInfo?.properties?.verified?.banner?.replace("ipfs://", "https://images.nf.domains/ipfs/") ??
    nfdInfo?.properties?.userDefined?.banner
  preparedInfo.name = nfdInfo.properties?.userDefined?.name
  preparedInfo.bio = nfdInfo.properties?.userDefined?.bio
  preparedInfo.website = nfdInfo.properties?.userDefined?.website
  preparedInfo.email = nfdInfo.properties?.verified?.email ?? nfdInfo.properties?.userDefined?.email
  preparedInfo.emailVerified = nfdInfo.properties?.verified?.email ? true : false
  preparedInfo.github =
    nfdInfo.properties?.verified?.github ?? nfdInfo.properties?.userDefined?.github
  preparedInfo.githubVerified = nfdInfo.properties?.verified?.github ? true : false
  preparedInfo.twitter =
    nfdInfo.properties?.verified?.twitter ?? nfdInfo.properties?.userDefined?.twitter
  preparedInfo.twitterVerified = nfdInfo.properties?.verified?.twitter ? true : false
  // Only attempt to resolve the Bluesky DID via their API if present
  if (nfdInfo.properties?.verified?.blueskydid) {
    preparedInfo.bluesky = await fetchBlueskyHandle(nfdInfo.properties.verified.blueskydid)
    preparedInfo.blueskyVerified = true
  } else if (nfdInfo.properties?.userDefined?.blueskydid) {
    preparedInfo.bluesky = await fetchBlueskyHandle(nfdInfo.properties.userDefined?.blueskydid)
  }
  // Only attempt to resolve the Discord snowflake ID via their API if present
  if (nfdInfo.properties?.verified?.discord) {
    preparedInfo.discord = await fetchDiscordUser(nfdInfo.properties.verified.discord)
    preparedInfo.discordVerified = true
  } else if (nfdInfo.properties?.userDefined?.discord) {
    preparedInfo.discord = nfdInfo.properties.userDefined?.discord
  }
  // Only attempt to resolve the Telegram ID via their API if present
  if (nfdInfo.properties?.verified?.telegram) {
    preparedInfo.telegram = await getUserHandleFromID(nfdInfo.properties.verified.telegram)
    preparedInfo.telegramVerified = true
  } else if (nfdInfo.properties?.userDefined?.telegram) {
    preparedInfo.telegram = nfdInfo.properties.userDefined?.telegram
  }
  preparedInfo.linkedin = nfdInfo.properties?.userDefined?.linkedin
  return preparedInfo
}

export const getPreparedNFDInfo = cache(async (nfdInfo: NfdRecordResponseFull) => {
  "use server" // NOTE: This runs on the server
  return prepareNFDInfo(nfdInfo)
}, "getPreparedNFDInfo")
