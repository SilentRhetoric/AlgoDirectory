import { createAsync, RouteDefinition, RouteSectionProps } from "@solidjs/router"
import SiteTitle from "~/components/SiteTitle"
import { getNFDInfo } from "~/lib/nfd-api"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

export default function ListingDetails(props: RouteSectionProps) {
  // Defering stream here so that the page doesn't navigate until the data loads
  // This prevents the site title from rendering incorrectly at first
  const nfdInfo = createAsync(() => getNFDInfo(props.params.name), { deferStream: true })
  return (
    <main class="flex flex-col gap-2 p-4">
      <SiteTitle>{nfdInfo()?.name.split(".")[0]}</SiteTitle>
      <div class="border-black flex aspect-[3/1] w-full flex-row items-center justify-center rounded-sm border-[1px]">
        {nfdInfo()?.properties?.userDefined?.banner ? (
          <img
            src={nfdInfo()?.properties?.userDefined?.banner}
            alt="banner"
            class="aspect-[3/1] w-full"
          />
        ) : (
          <p class="text-xs">No banner</p>
        )}
      </div>
      <div class="grid grid-cols-[96px_auto] gap-2 text-balance text-sm min-[375px]:text-base sm:text-lg">
        <div>
          <div class="border-black flex h-16 w-16 flex-row items-center justify-center rounded-sm border-[1px]">
            {nfdInfo()?.properties?.userDefined?.avatar ? (
              <img
                src={nfdInfo()?.properties?.userDefined?.avatar}
                alt="avatar"
                class="aspect-square"
              />
            ) : (
              <p class="text-xs">No avatar</p>
            )}
          </div>
        </div>
        <h1 class="self-center text-2xl uppercase sm:text-5xl">{nfdInfo()?.name.split(".")[0]}</h1>
        <p class="uppercase">Website</p>
        <a href={nfdInfo()?.properties?.userDefined?.website}>
          {nfdInfo()?.properties?.userDefined?.website}
        </a>
        <p class="uppercase">Name</p>
        <p>{nfdInfo()?.properties?.userDefined?.name}</p>
        <p class="uppercase">Bio</p>
        <p>{nfdInfo()?.properties?.userDefined?.bio}</p>
        <p class="uppercase">Email</p>
        <p>{nfdInfo()?.properties?.userDefined?.email}</p>
        <p class="uppercase">Address</p>
        <p>{nfdInfo()?.properties?.userDefined?.address}</p>
        <p class="uppercase">GitHub</p>
        <p>{nfdInfo()?.properties?.userDefined?.github}</p>
        <p class="uppercase">Twitter</p>
        <p>{nfdInfo()?.properties?.userDefined?.twitter}</p>
        <p class="uppercase">Discord</p>
        <p>{nfdInfo()?.properties?.userDefined?.discord}</p>
        <p class="uppercase">Telegram</p>
        <p>{nfdInfo()?.properties?.userDefined?.telegram}</p>
        <p class="uppercase">LinkedIn</p>
        <p>{nfdInfo()?.properties?.userDefined?.linkedin}</p>
      </div>
    </main>
  )
}

// TODO: If the list of listings is stored in state, next/prev buttons can be added to navigate between listings
