//https://gram.js.org/getting-started/authorization#getting-api-id-and-api-hash

const API_ID = Number(import.meta.env.VITE_TELEGRAM_API_ID)
const API_HASH = import.meta.env.VITE_TELEGRAM_API_HASH
const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN

import { Api, TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions"

const session = new StringSession("") // You should put your string session here
const client = new TelegramClient(session, API_ID, API_HASH, {})

export async function getFullUser(id: string) {
  console.debug("getFullUser (TG): ", id)
  await client.start({
    botAuthToken: BOT_TOKEN,
  })
  await client.connect() // This assumes you have already authenticated with .start()
  const result = await client.invoke(
    new Api.users.GetFullUser({
      id,
    }),
  )
  console.log(result)
  return "test"
}

/*
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const stringSession = ""; // leave this empty for now
const BOT_TOKEN = ""; // put your bot token here

(async () => {
  const client = new TelegramClient(
    new StringSession(stringSession),
    apiId,
    apiHash,
    { connectionRetries: 5 }
  );
  await client.start({
    botAuthToken: BOT_TOKEN,
  });
  console.log(client.session.save());
})();
*/
