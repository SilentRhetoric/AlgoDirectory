/*
This file contains the logic to call the NFD API for a given name
that is a segment of directory.algo and get its properties.
*/

import { cache } from "@solidjs/router"
import { NfdRecordResponseFull } from "~/lib/nfd-swagger-codegen"

// TODO: Use netlify.toml to set something so that this will query the
// mainnet API when deployed on Netlify and otherwise default to testnet

const segment = (name: string) =>
  `https://api.testnet.nf.domains/nfd/${name}.directory.algo?view=full&poll=false&nocache=false`

async function fetchNFDInfo(name: string) {
  const url = segment(name)
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
