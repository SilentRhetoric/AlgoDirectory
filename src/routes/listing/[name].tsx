import { createAsync, RouteDefinition, RouteSectionProps } from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo } from "@/lib/nfd-api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Match, Switch } from "solid-js"
import ArrowLeftCircle from "@/components/icons/ArrowCirlceLeft"
import { useNavigate } from "@solidjs/router"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

export default function ListingDetails(props: RouteSectionProps) {
  const navigate = useNavigate();

  // Defering stream here so that the page doesn't navigate until the data loads
  // This prevents the site title from rendering incorrectly at first
  const nfdInfo = createAsync(() => getNFDInfo(props.params.name), { deferStream: true })
  return (
    <main class="flex flex-col gap-2 p-4">
      <Card class="w-full max-w-6xl mx-auto">
        <div class="relative flex justify-center items-center w-full h-full mb-4">
        {nfdInfo()?.properties?.userDefined?.banner ? (
          <>
            <img
              src={nfdInfo()?.properties?.userDefined?.banner}
              alt="banner"
              class="aspect-[2/1] w-full border-b" 
            />
            <div class="absolute -bottom-6 left-6 sm:-bottom-10 sm:left-10">
              <div class="w-20 h-20 sm:w-32 sm:h-32 border-4 rounded-full border-background">
                <img
                  src={nfdInfo()?.properties?.userDefined?.avatar} 
                  alt="avatar"
                  class="rounded-full w-full h-full"
                />
              </div>
            </div>
          </>
        ) : (
          <p class="aspect-[2/1] w-full border-b flex justify-center items-center text-xs">No banner</p>
        )}
        </div>
        <CardHeader class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle class="text-2xl font-bold">
            {nfdInfo()?.name.split(".")[0]}
          </CardTitle>
          <Switch>
            <Match when={nfdInfo()?.state === "owned" as any}>
              <Badge variant={'default'} class="capitalize">
                <span>Owned</span>
              </Badge>
            </Match>
            <Match when={nfdInfo()?.state === "forSale" as any}>
              <Badge variant={'destructive'} class="capitalize">
                <span>For Sale</span>
              </Badge>
            </Match>
            <Match when={nfdInfo()?.state === "expired" as any}>
              <Badge variant={'destructive'} class="capitalize">
                <span>Expired</span>
              </Badge>
            </Match>
          </Switch>
        </CardHeader>
        <CardContent class="grid gap-6">
          <div class="flex gap-2 overflow-auto">
            <span class="flex flex-row items-center gap-2 break-words">
              {/* <LinkIcon className="w-4 h-4 text-muted-foreground" /> */}
              <span class="font-semibold">Website:</span>
              <a
                href={nfdInfo()?.properties?.userDefined?.website}
                class="underline break-words overflow-clip"
              >
                {nfdInfo()?.properties?.userDefined?.website}
              </a>
            </span>
          </div>
          <div class="grid lg:grid-cols-2 xl:grid-cols-2 gap-5 overflow-auto">
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <NoteBookIcon className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Name:</span>
                {nfdInfo()?.properties?.userDefined?.name}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <Email className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Email:</span>
                {nfdInfo()?.properties?.userDefined?.email}
              </span>
            </div>
            <div class="flex flex-col gap-2 w-full">
              <div class="flex flex-row items-center gap-2 break-words">
                {/* <AddressIcon className="w-4 h-4 text-muted-foreground" /> */}
                <span class="flex flex-row items-center">
                  <span class="font-semibold">
                    Address:
                  </span>
                </span>
                <span class="flex items-base overflow-auto w-full break-words">
                  {nfdInfo()?.properties?.userDefined?.address}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <GithubIcon className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Github:</span>
                {nfdInfo()?.properties?.userDefined?.github}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <TwitterIcon className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Twitter:</span>
                {nfdInfo()?.properties?.userDefined?.twitter}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <Email className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Discord:</span>
                {nfdInfo()?.properties?.userDefined?.discord}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <Email className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">Telegram:</span>
                {nfdInfo()?.properties?.userDefined?.telegram}
              </span>
            </div>
            <div class="flex flex-col gap-2">
              <span class="flex flex-row items-center gap-2">
                {/* <Email className="w-4 h-4 text-muted-foreground" /> */}
                <span class="font-semibold">LinkedIn:</span>
                <a
                  href={nfdInfo()?.properties?.userDefined?.linkedin}
                  class="underline overflow-hidden overflow-ellipsis"
                >
                  {nfdInfo()?.properties?.userDefined?.linkedin}
                </a>
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="flex flex-row items-base gap-2">
              {/* <UserRoundPen className="w-4 h-4 text-muted-foreground" /> */}
              <span class="font-semibold">Bio:</span>
              {nfdInfo()?.properties?.userDefined?.bio}
            </span>
          </div>
        </CardContent>
        <CardFooter class="flex justify-between">
          <Button 
            variant="outline"
            onclick={() => navigate("/")}
          >
            <ArrowLeftCircle className="w-4 h-4 mr-2" />
            Back to Listings
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

// TODO: If the list of listings is stored in state, next/prev buttons can be added to navigate between listings
