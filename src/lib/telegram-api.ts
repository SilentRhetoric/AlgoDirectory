const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

export type TelegramData = {
  ok: boolean
  result: {
    id: number
    first_name: string
    last_name: string
    username: string
    type: string
    bio: string
    has_private_forwards: boolean
    photo: {
      small_file_id: string
      small_file_unique_id: string
      big_file_id: string
      big_file_unique_id: string
    }
  }
}

export async function getUserHandleFromID(id: string): Promise<string> {
  "use server" // NOTE: This runs on the server
  console.debug("getUserHandleFromID (TG): ", id)
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChat?chat_id=${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: id,
      }),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const userData = (await response.json()) as TelegramData
    return userData.result.username as string
  } catch (error) {
    console.error("Error fetching Telegram username:", error)
    throw error
  }
}
