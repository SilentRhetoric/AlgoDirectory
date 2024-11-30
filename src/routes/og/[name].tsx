import satori, { SatoriOptions } from "satori"
import { html } from "satori-html"
import { Resvg } from "@resvg/resvg-js"
import { APIEvent } from "node_modules/@solidjs/start/dist/server"

const baseUrl = import.meta.env.DEV ? "http://localhost:3000" : "https://algodirectory.app"

const inter = async () => {
  const url = new URL(`/Inter_18pt-Thin.ttf`, baseUrl)
  return await fetch(url).then((res) => res.arrayBuffer())
}

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  embedFont: true,
  fonts: [
    {
      name: "Inter",
      data: await inter(),
      weight: 100,
      style: "normal",
    },
  ],
}

export async function GET(event: APIEvent) {
  const markup = `
    <html>
      <body style="margin: 0; padding: 0; background-color: black;">
        <div
          style="padding: 5%; display: flex; flex-direction: column; align-items: flex-start; justify-content: center; height: 100vh; width: 100vw; overflow: hidden; position: relative; font-family: "Inter"; font-weight: 100; color: white;"
        >
          <div style="font-size: 96;">${event.params.name}</div>
          <div style="font-size: 48;">AlgoDirectory</div>
        </div>
      </body>
    </html>
  `

  const svg = await satori(html(markup), options)

  const png = new Resvg(svg, { font: { sansSerifFamily: "Inter" } }).render().asPng()

  return new Response(png, { headers: { "Content-Type": "image/png" } })
}
