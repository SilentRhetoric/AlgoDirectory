// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server"

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <meta
            name="theme-color"
            content="#FFFFFF"
          />
          <title>AlgoDirectory</title>
          <meta
            name="description"
            content="An on-chain directory of the Algorand ecosystem"
          />
          <meta
            property="og:url"
            content="https://algodirectory.app"
          />
          <meta
            property="og:type"
            content="website"
          />
          <meta
            property="og:title"
            content="AlgoDirectory"
          />
          <meta
            property="og:description"
            content="An on-chain directory of the Algorand ecosystem"
          />
          <meta
            property="og:image"
            content="https://opengraph.b-cdn.net/production/images/9b10ce19-396e-483f-a1c1-643401552eb6.png?token=Itz-ScX30tGgcEFr9hddqhrAzRy9tDH2vvxf9x-hTOI&height=630&width=1199&expires=33266059103"
          />
          <meta
            name="twitter:card"
            content="summary_large_image"
          />
          <meta
            property="twitter:domain"
            content="algodirectory.app"
          />
          <meta
            property="twitter:url"
            content="https://algodirectory.app"
          />
          <meta
            name="twitter:title"
            content="AlgoDirectory"
          />
          <meta
            name="twitter:description"
            content="An on-chain directory of the Algorand ecosystem"
          />
          <meta
            name="twitter:image"
            content="https://opengraph.b-cdn.net/production/images/9b10ce19-396e-483f-a1c1-643401552eb6.png?token=Itz-ScX30tGgcEFr9hddqhrAzRy9tDH2vvxf9x-hTOI&height=630&width=1199&expires=33266059103"
          />
          <link
            rel="icon"
            type="image/png"
            href="/favicon-48x48.png"
            sizes="48x48"
          />
          <link
            rel="icon"
            type="image/svg+xml"
            href="/favicon.svg"
          />
          <link
            rel="shortcut icon"
            href="/favicon.ico"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="Directory"
          />
          <link
            rel="manifest"
            href="/site.webmanifest"
          />
          {assets}
        </head>
        <body>
          <script>global = globalThis</script>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
))
