import SiteTitle from "~/components/SiteTitle"
import { clientOnly } from "@solidjs/start"

// To isolate the wallet state from the server, it is contained in a component
// that is loaded only on the client side.
const ClientOnlyWalletWrapper = clientOnly(() => import("../components/WalletWrapper"))

export default function Manage() {
  return (
    <main class="mx-auto p-4">
      <SiteTitle>Manage</SiteTitle>
      <ClientOnlyWalletWrapper />
    </main>
  )
}
