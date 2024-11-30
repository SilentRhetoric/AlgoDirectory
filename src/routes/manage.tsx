import SiteTitle from "@/components/SiteTitle"
import { Meta } from "@solidjs/meta"
import { clientOnly } from "@solidjs/start"

// To isolate the wallet state from the server, it is contained in a component
// that is loaded only on the client side.
const ClientOnlyWalletWrapper = clientOnly(() => import("../components/WalletWrapper"))

export default function Manage() {
  return (
    <main class="mx-auto p-4">
      <SiteTitle>Manage</SiteTitle>
      <Meta
        property="og:url"
        content="https://algodirectory.app"
      />
      <Meta
        property="og:type"
        content="website"
      />
      <Meta
        property="og:title"
        content="AlgoDirectory"
      />
      <Meta
        property="og:description"
        content="A decentralized, on-chain directory for the Algorand ecosystem"
      />
      <Meta
        property="og:image"
        content="https://opengraph.b-cdn.net/production/images/9b10ce19-396e-483f-a1c1-643401552eb6.png?token=Itz-ScX30tGgcEFr9hddqhrAzRy9tDH2vvxf9x-hTOI&height=630&width=1199&expires=33266059103"
      />
      <Meta
        name="twitter:card"
        content="summary_large_image"
      />
      <Meta
        property="twitter:domain"
        content="algodirectory.app"
      />
      <Meta
        property="twitter:url"
        content="https://algodirectory.app"
      />
      <Meta
        name="twitter:title"
        content="AlgoDirectory"
      />
      <Meta
        name="twitter:description"
        content="A decentralized, on-chain directory for the Algorand ecosystem"
      />
      <Meta
        name="twitter:image"
        content="https://opengraph.b-cdn.net/production/images/9b10ce19-396e-483f-a1c1-643401552eb6.png?token=Itz-ScX30tGgcEFr9hddqhrAzRy9tDH2vvxf9x-hTOI&height=630&width=1199&expires=33266059103"
      />
      <ClientOnlyWalletWrapper />
    </main>
  )
}
