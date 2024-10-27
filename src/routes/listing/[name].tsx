import { createAsync, RouteDefinition, RouteSectionProps } from "@solidjs/router"
import SiteTitle from "@/components/SiteTitle"
import { getNFDInfo } from "@/lib/nfd-api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  const navigate = useNavigate()

  // Defering stream here so that the page doesn't navigate until the data loads
  // This prevents the site title from rendering incorrectly at first
  const nfdInfo = createAsync(() => getNFDInfo(props.params.name), { deferStream: true })
  return (
    <main class="flex flex-col gap-2 p-4">
      <Card class="mx-auto w-full max-w-6xl">
        <div class="relative mb-4 flex h-full w-full items-center justify-center">
          {nfdInfo()?.properties?.userDefined?.banner ? (
            <>
              <img
                src={nfdInfo()?.properties?.userDefined?.banner}
                alt="banner"
                class="aspect-[2/1] w-full border-b"
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
          <CardTitle class="text-2xl font-bold">{nfdInfo()?.name.split(".")[0]}</CardTitle>
          <Switch>
            <Match when={nfdInfo()?.state === ("owned" as any)}>
              <Badge
                variant={"default"}
                class="capitalize"
              >
                <span>Owned</span>
              </Badge>
            </Match>
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
        <CardContent class="grid gap-6">
          <div class="flex gap-2 overflow-auto">
            <span class="flex flex-row items-center gap-2 break-words">
              {/* <LinkIcon className="w-4 h-4 text-muted-foreground" /> */}
              <span class="font-semibold">Website:</span>
              <a
                href={nfdInfo()?.properties?.userDefined?.website}
                class="overflow-clip break-words underline"
              >
                {nfdInfo()?.properties?.userDefined?.website}
              </a>
            </span>
          </div>
          <div class="grid gap-5 overflow-auto lg:grid-cols-2 xl:grid-cols-2">
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
            <div class="flex w-full flex-col gap-2">
              <div class="flex flex-row items-center gap-2 break-words">
                {/* <AddressIcon className="w-4 h-4 text-muted-foreground" /> */}
                <span class="flex flex-row items-center">
                  <span class="font-semibold">Address:</span>
                </span>
                <span class="items-base flex w-full overflow-auto break-words">
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
                  class="overflow-hidden overflow-ellipsis underline"
                >
                  {nfdInfo()?.properties?.userDefined?.linkedin}
                </a>
              </span>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <span class="items-base flex flex-row gap-2">
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
            <ArrowLeftCircle className="mr-2 h-4 w-4" />
            Back to Listings
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
