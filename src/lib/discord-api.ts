const DISCORD_TOKEN = import.meta.env.VITE_DISCORD_TOKEN

export async function fetchDiscordUser(snowflakeId: string): Promise<string> {
  "use server" // NOTE: This runs on the server
  console.debug("fetchDiscordUser:", snowflakeId)
  try {
    const response = await fetch(`https://discord.com/api/users/${snowflakeId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_TOKEN}`,
        Accept: "application/json",
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const userData = await response.json()
    return userData.username as string
  } catch (error) {
    console.error("Error fetching Discord username:", error)
    throw error
  }
}
