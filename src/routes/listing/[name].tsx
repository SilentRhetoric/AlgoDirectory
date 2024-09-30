import { createAsync, RouteDefinition, useParams } from "@solidjs/router"
import { getNFDInfo } from "~/lib/nfd-api"

export const route = {
  preload({ params }) {
    void getNFDInfo(params.name)
  },
} satisfies RouteDefinition

export default function ListingDetails() {
  const params = useParams()
  const nfdInfo = createAsync(() => getNFDInfo(params.name))
  return (
    <main class="flex flex-col gap-2 font-thin">
      {nfdInfo()?.properties?.userDefined?.banner ? (
        <img
          src={nfdInfo()?.properties?.userDefined?.banner}
          alt="banner"
          class="aspect-[3/1] w-full"
        />
      ) : null}

      <img
        src={nfdInfo()?.properties?.userDefined?.avatar}
        alt="avatar"
        class="aspect-square h-32 w-32"
      />

      <h1 class="text-6xl uppercase">{nfdInfo()?.name.split(".")[0]}</h1>

      {nfdInfo()?.properties?.userDefined?.website ? (
        <div class="flex">
          <p class="w-32 uppercase">Website</p>
          <a href={nfdInfo()?.properties?.userDefined?.website}>
            {nfdInfo()?.properties?.userDefined?.website}
          </a>
        </div>
      ) : null}

      {nfdInfo()?.properties?.userDefined?.name ? (
        <div class="flex">
          <p class="w-32 uppercase">Name</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.name}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.bio ? (
        <div class="flex">
          <p class="w-32 uppercase">Bio</p>
          <p class="grow text-wrap">{nfdInfo()?.properties?.userDefined?.bio}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.email ? (
        <div class="flex">
          <p class="w-32 uppercase">Email</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.email}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.address ? (
        <div class="flex">
          <p class="w-32 uppercase">Address</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.address}</p>
        </div>
      ) : null}

      {nfdInfo()?.properties?.userDefined?.github ? (
        <div class="flex">
          <p class="w-32 uppercase">GitHub</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.github}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.twitter ? (
        <div class="flex">
          <p class="w-32 uppercase">Twitter</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.twitter}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.discord ? (
        <div class="flex">
          <p class="w-32 uppercase">Discord</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.discord}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.telegram ? (
        <div class="flex">
          <p class="w-32 uppercase">Telegram</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.telegram}</p>
        </div>
      ) : null}
      {nfdInfo()?.properties?.userDefined?.linkedin ? (
        <div class="flex">
          <p class="w-32 uppercase">LinkedIn</p>
          <p class="grow">{nfdInfo()?.properties?.userDefined?.linkedin}</p>
        </div>
      ) : null}
    </main>
  )
}
