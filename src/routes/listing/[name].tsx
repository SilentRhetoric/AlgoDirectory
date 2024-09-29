import { createAsync, RouteDefinition, useParams } from "@solidjs/router"
import { getNFDInfo } from "~/lib/nfd-api"

export const route = {
  preload({ location, params, intent }) {
    void getNFDInfo(params.name)
    console.log("location", location.pathname)
    console.log("params", params.name)
    console.log("intent", intent)
  },
} satisfies RouteDefinition

export default function ListingDetails() {
  const params = useParams()
  const nfdInfo = createAsync(() => getNFDInfo(params.name))
  return (
    <main class="flex flex-col gap-2">
      <pre>Listing {JSON.stringify(nfdInfo(), null, 2)}</pre>
    </main>
  )
}
