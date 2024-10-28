import { createAsync, RouteDefinition, RouteSectionProps } from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo } from "@/lib/nfd-api"
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
import { createComputed, createMemo, createResource, Match, Suspense, Switch } from "solid-js"
import { fetchSingleListing } from "@/lib/algod-api"
import { formatTimestamp } from "@/lib/utilities"
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import AlgorandLogo from "@/components/icons/AlgorandLogo"
// import ArrowLeftCircle from "@/components/icons/ArrowCirlceLeft"
// import { useNavigate } from "@solidjs/router"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

export default function ListingDetails(props: RouteSectionProps) {
  // const navigate = useNavigate()

  // Defering stream here so that the page doesn't navigate until the data loads
  // This prevents the site title from rendering incorrectly at first
  const nfdInfo = createAsync(() => getNFDInfo(props.params.name), { deferStream: true })
  const nfdAppId = createMemo(() => nfdInfo()?.appID)
  const [listingInfo] = createResource(nfdAppId, fetchSingleListing)
  createComputed(() => console.debug("listingInfo: ", listingInfo()))

  return (
    <main class="flex flex-col gap-2 p-4">
      <SiteTitle>{nfdInfo()?.name.split(".")[0].toUpperCase()}</SiteTitle>
      <Card class="mx-auto w-full max-w-6xl">
        <div class="relative mb-4 flex h-full w-full items-center justify-center">
          {nfdInfo()?.properties?.userDefined?.banner ? (
            <>
              <img
                src={nfdInfo()?.properties?.userDefined?.banner}
                alt="banner"
                class="aspect-[2/1] w-full overflow-hidden rounded-t-xl border-b"
              />
              <div class="absolute -bottom-6 left-6 sm:-bottom-10 sm:left-10">
                <div class="h-20 w-20 rounded-full border-4 border-background sm:h-32 sm:w-32">
                  <img
                    src={nfdInfo()?.properties?.userDefined?.avatar}
                    alt="avatar"
                    class="h-full w-full rounded-full"
                  />
                </div>
              </div>
            </>
          ) : (
            <p class="flex aspect-[2/1] w-full items-center justify-center border-b text-xs">
              No banner
            </p>
          )}
        </div>
        <CardHeader class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <CardTitle class="text-2xl uppercase sm:pt-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            {nfdInfo()?.name.split(".")[0]}
          </CardTitle>
          <Switch>
            {/* <Match when={nfdInfo()?.state === ("owned" as any)}>
              <Badge
                variant={"default"}
                class="capitalize"
              >
                <span>Owned</span>
              </Badge>
            </Match> */}
            <Match when={nfdInfo()?.state === ("forSale" as any)}>
              <Badge
                variant={"destructive"}
                class="capitalize"
              >
                <span>For Sale</span>
              </Badge>
            </Match>
            <Match when={nfdInfo()?.state === ("expired" as any)}>
              <Badge
                variant={"destructive"}
                class="capitalize"
              >
                <span>Expired</span>
              </Badge>
            </Match>
          </Switch>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading...</div>}>
            <div class="mb-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
              <div id="listingFirstColumn flex flex-col gap-2">
                <div class="flex">
                  <p class="w-32 uppercase">Tags</p>
                  <p class="overflow-hidden text-wrap break-words">TAGS GO HERE @TAKO</p>
                </div>
              </div>
              <div id="listingSecondColumn flex flex-col gap-2">
                <div class="flex">
                  <p class="w-32 uppercase">Value</p>
                  <p class="flex flex-row items-center gap-1">
                    <AlgorandLogo />
                    {`${listingInfo()?.vouchAmount ? new AlgoAmount({ microAlgo: listingInfo()?.vouchAmount! }).algo : ""}`}
                  </p>
                </div>
                <div class="flex">
                  <p class="w-32 uppercase">Updated</p>
                  <p class="overflow-hidden text-wrap break-words">
                    {`${listingInfo()?.timestamp ? formatTimestamp(listingInfo()!.timestamp) : ""}`}
                  </p>
                </div>
              </div>
            </div>
          </Suspense>
          <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-2">
            <div id="NFDFirstColumn flex flex-col gap-2">
              <div class="flex">
                <p class="w-32 uppercase">Name</p>
                <p class="overflow-hidden text-wrap break-words">
                  {nfdInfo()?.properties?.userDefined?.name}
                </p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Bio</p>
                <p class="overflow-hidden text-wrap break-words">
                  {nfdInfo()?.properties?.userDefined?.bio}
                </p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Website</p>
                <a
                  href={nfdInfo()?.properties?.userDefined?.website}
                  class="overflow-hidden text-wrap break-words hover:underline"
                >
                  {nfdInfo()?.properties?.userDefined?.website}
                </a>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Email</p>
                <a
                  href={`mailto:${nfdInfo()?.properties?.userDefined?.email}`}
                  class="overflow-hidden text-wrap break-words hover:underline"
                >
                  {nfdInfo()?.properties?.userDefined?.email}
                </a>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Address</p>
                <p class="overflow-hidden text-wrap break-words">
                  {nfdInfo()?.properties?.userDefined?.address}
                </p>
              </div>
            </div>
            <div id="NFDSecondColumn">
              {/* TODO: Twitter/Discord/Telegram/GitHub can be verified on NFD */}
              <div class="flex">
                <p class="w-32 uppercase">GitHub</p>
                <p>{nfdInfo()?.properties?.userDefined?.github}</p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Twitter</p>
                <p>{nfdInfo()?.properties?.userDefined?.twitter}</p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Discord</p>
                <p>{nfdInfo()?.properties?.userDefined?.discord}</p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">Telegram</p>
                <p>{nfdInfo()?.properties?.userDefined?.telegram}</p>
              </div>
              <div class="flex">
                <p class="w-32 uppercase">LinkedIn</p>
                <a
                  href={nfdInfo()?.properties?.userDefined?.linkedin}
                  class="overflow-hidden text-wrap break-words hover:underline"
                >
                  {nfdInfo()?.properties?.userDefined?.linkedin}
                </a>
              </div>
            </div>
          </div>
        </CardContent>
        {/* <CardFooter class="flex justify-between">
          <Button
            variant="outline"
            onclick={() => navigate("/")}
          >
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </CardFooter> */}
      </Card>
    </main>
  )
}
