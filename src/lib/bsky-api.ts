export async function fetchBlueskyHandle(did: string): Promise<string> {
  console.debug("fetchBlueskyProfile:", did)
  try {
    // Resolve the DID to get the handle
    const response = await fetch(
      `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${did}`,
      { headers: { Accept: "application/json" } },
    )
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const profileData = await response.json()
    return profileData.handle as string
  } catch (error) {
    console.error("Error fetching Bluesky handle:", error)
    throw error
  }
}
