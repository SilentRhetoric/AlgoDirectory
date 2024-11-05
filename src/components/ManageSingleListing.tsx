import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import { TransactionSigner } from "algosdk"
import { Component, createResource, createSignal, Show, Suspense } from "solid-js"
import { algorand, DIRECTORY_APP_ID, fetchSingleListing } from "@/lib/algod-api"
import { NfdRecord } from "@/lib/nfd-swagger-codegen"
import { formatTimestamp } from "@/lib/formatting"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import MultiSelectTags from "./MultiSelectTags"
import AlgorandLogo from "./icons/AlgorandLogo"
import LoadingIcon from "./icons/LoadingIcon"
import { AlgoDirectoryClient } from "@/lib/AlgoDirectoryClient"
import ManageListingSkeleton from "./ManageListingSkeleton"
import LinkIcon from "./icons/LinkIcon"
import { nfdSiteUrlRoot } from "@/lib/nfd-api"
import { NUM_TAGS_ALLOWED } from "@/lib/constants"

type ManageSingleListingProps = {
  segment: NfdRecord
  sender: string
  transactionSigner: TransactionSigner
  masterTagList: string[]
  sortedMasterTagList: string[]
  masterTagMap: Map<string, string>
}

type TypeSubmitting = "create" | "refresh" | "abandon"

export const ManageSingleListing: Component<{
  segment: NfdRecord
  sender: string
  transactionSigner: TransactionSigner
  masterTagList: string[]
  sortedMasterTagList: string[]
  masterTagMap: Map<string, string>
}> = (props: ManageSingleListingProps) => {
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [typeSubmitting, setTypeSubmitting] = createSignal<TypeSubmitting>()
  const [vouchAmount, setVouchAmount] = createSignal(0.0722) // Each listing requires min 72_200uA
  const [tags, setTags] = createSignal<string[]>([])

  const expiredOrForSale = (segment: NfdRecord) => {
    if (segment.expired === true) {
      return true
    }
    // Weird error when using NfdRecord.StateEnum.ForSale
    // @ts-expect-error
    if (segment.state === "forSale") {
      return true
    } else return false
  }

  const expiredOrForSaleText = (segment: NfdRecord) => {
    if (segment.expired === true) {
      return "Expired"
    }
    // Weird error when using NfdRecord.StateEnum.ForSale
    // @ts-expect-error
    if (segment.state === "forSale") {
      return "For Sale"
    } else return false
  }

  // Client created here so it is configured to send from the connected account
  const typedAppClient = algorand().client.getTypedAppClientById(AlgoDirectoryClient, {
    appId: BigInt(DIRECTORY_APP_ID),
    defaultSender: props.sender,
  })

  // Fetch the listing data for this segment
  const [listingInfo, { refetch }] = createResource(async () => {
    try {
      const response = await fetchSingleListing(props.segment.appID!)
      // Update tags from Uint8Array to string[]
      setTags(
        Array.from(response?.tags || [])
          .slice(0, NUM_TAGS_ALLOWED)
          .filter((tag: number) => tag !== 0)
          .map((tag: number) => {
            return props.masterTagList[tag - 1]
          }),
      )

      // Update vouch amount
      setVouchAmount(new AlgoAmount({ microAlgo: response?.vouchAmount }).algo)
      return response
    } catch (error: any) {
      if (error?.message.includes("box not found")) {
        console.debug(`No box data for: \n${props.segment.appID} - (${props.segment.name})`)
      } else {
        console.error("Error fetching listing: ", error?.message)
      }
      return null
    }
  })

  const getUInt8Tags = () => {
    const newTags = new Uint8Array(13)

    // Convert tags to ints using the masterTagMap
    const uInt8Tags2 = tags().map((tag: string) => parseInt(props.masterTagMap.get(tag)!))
    newTags.set(uInt8Tags2)
    return newTags
  }

  async function createListing() {
    setIsSubmitting(true)
    setTypeSubmitting("create")
    const newTags = getUInt8Tags()
    const payTxn = await algorand().createTransaction.payment({
      sender: props.sender,
      receiver: typedAppClient.appAddress,
      amount: AlgoAmount.Algo(vouchAmount()),
    })
    console.debug("payTxn: ", payTxn)
    try {
      const createResult = await typedAppClient.send.createListing({
        args: {
          collateralPayment: payTxn,
          nfdAppId: props.segment.appID!,
          listingTags: newTags,
        },
        extraFee: (1000).microAlgo(),
        signer: props.transactionSigner,
        populateAppCallResources: true,
        note: "I have read and agree to the AlgoDirectory Terms of Use and Privacy Policy at https://algodirectory.app/about.",
      })
      console.debug("createResult: ", createResult)
    } catch (error: any) {
      console.error("Error creating listing: ", error)
    } finally {
      refetch()
      setIsSubmitting(false)
    }
  }

  async function refreshListing() {
    setIsSubmitting(true)
    setTypeSubmitting("refresh")
    const newTags = getUInt8Tags()
    try {
      const refreshResult = await typedAppClient.send.refreshListing({
        args: {
          nfdAppId: props.segment.appID!,
          listingTags: newTags,
        },
        signer: props.transactionSigner,
        populateAppCallResources: true,
      })
      console.debug("refreshResult: ", refreshResult)
    } catch (error: any) {
      console.error("Error refreshing listing: ", error)
    } finally {
      refetch()
      setIsSubmitting(false)
    }
  }

  async function abandonListing() {
    setIsSubmitting(true)
    setTypeSubmitting("abandon")
    try {
      const abandonResult = await typedAppClient.send.abandonListing({
        args: {
          nfdAppId: props.segment.appID!,
        },
        extraFee: (1000).microAlgo(),
        signer: props.transactionSigner,
        populateAppCallResources: true,
      })
      console.debug("abandonResult: ", abandonResult)
    } catch (error: any) {
      console.error("Error abandoning listing: ", error)
    } finally {
      setTags([])
      setVouchAmount(0.0722)
      refetch()
      setIsSubmitting(false)
    }
  }

  return (
    <Suspense
      fallback={
        <span class="animate-pulse">
          <ManageListingSkeleton />
        </span>
      }
    >
      <Show
        when={listingInfo.latest}
        fallback={
          <Card>
            <CardHeader>
              <CardTitle class="flex flex-row gap-2">
                <a
                  href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${props.segment.name}`}
                  target="_blank"
                  class="flex flex-row gap-2"
                >
                  {props.segment.name.split(".")[0]} <LinkIcon />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent class="flex h-48 w-full flex-col justify-between">
              <div class="flex w-full flex-col">
                <label class="uppercase text-red-500">{expiredOrForSaleText(props.segment)}</label>
                <div class="flex w-full flex-row justify-between">
                  <label class="uppercase">Vouch Amount</label>
                  <div class="flex flex-row items-center gap-1">
                    <input
                      disabled={isSubmitting()}
                      class="h-8 w-32 rounded-md border bg-transparent p-4"
                      type="number"
                      min={0.0722}
                      value={vouchAmount()}
                      onChange={(
                        e: Event & {
                          currentTarget: HTMLInputElement
                          target: HTMLInputElement
                        },
                      ) => {
                        setVouchAmount(Number(e.target.value))
                      }}
                    />
                    <AlgorandLogo />
                  </div>
                </div>
              </div>
              <div class="flex flex-col justify-end gap-2">
                <div class="flex flex-wrap justify-start gap-2">
                  {tags().map((tag: string) => (
                    <Badge
                      class="hover:bg-transparent"
                      variant="outline"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Show
                  when={!expiredOrForSale(props.segment)}
                  fallback={null}
                >
                  <MultiSelectTags
                    tags={tags()}
                    masterlist={props.sortedMasterTagList}
                    isSubmitting={isSubmitting()}
                    // isDisabled={expiredOrForSale(props.segment)}
                    setTags={setTags}
                  />
                </Show>
              </div>
            </CardContent>
            <div class="px-6">
              <div class="-mx-6 mb-4 h-px bg-border" />
            </div>
            <CardFooter class="flex flex-col items-center justify-center">
              <Button
                disabled={expiredOrForSale(props.segment) || isSubmitting()}
                onClick={createListing}
                variant="outline"
                class="flex w-full flex-row items-center justify-center gap-2 border-[0.5px] border-[hsl(var(--primary))] uppercase hover:bg-[hsl(var(--primary))] hover:text-white"
              >
                <Show when={isSubmitting() && typeSubmitting() === "create"}>
                  <span class="animate-spin">
                    <LoadingIcon className="size-4" />
                  </span>
                </Show>
                Create Listing
              </Button>
            </CardFooter>
          </Card>
        }
      >
        <Card>
          <CardHeader>
            <CardTitle class="flex flex-row gap-2">
              <a
                href={`https://app.${nfdSiteUrlRoot}nf.domains/name/${props.segment.name}`}
                target="_blank"
                class="flex flex-row gap-2"
              >
                {props.segment.name.split(".")[0]} <LinkIcon />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent class="flex h-48 w-full flex-col justify-between">
            <div class="flex w-full flex-col">
              <label class="uppercase text-red-500">{expiredOrForSaleText(props.segment)}</label>
              <div class="flex flex-row items-center justify-between">
                <label class="uppercase">Vouch Amount</label>
                <div class="flex flex-row items-center gap-1">
                  <span>{vouchAmount()}</span>
                  <AlgorandLogo />
                </div>
              </div>
              <div class="flex flex-row justify-between">
                <label class="uppercase">Updated</label>
                <span>{`${listingInfo()?.timestamp ? formatTimestamp(listingInfo()!.timestamp) : ""}`}</span>
              </div>
            </div>
            <div class="flex flex-col justify-end gap-2">
              <div class="flex flex-wrap justify-start gap-2">
                {tags().map((tag: string) => (
                  <Badge
                    class="hover:bg-transparent"
                    variant="outline"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <MultiSelectTags
                tags={tags()}
                masterlist={props.sortedMasterTagList}
                isSubmitting={isSubmitting()}
                setTags={setTags}
              />
            </div>
          </CardContent>
          <div class="px-6">
            <div class="-mx-6 mb-4 h-px bg-border" />
          </div>
          <CardFooter>
            <div class="flex w-full flex-col items-center justify-start gap-2">
              <Button
                variant="outline"
                class="flex w-full flex-row items-center justify-center gap-2 uppercase"
                disabled={expiredOrForSale(props.segment) || isSubmitting()}
                onClick={refreshListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "refresh"}>
                  <span class="animate-spin">
                    <LoadingIcon className="size-4" />
                  </span>
                </Show>
                Refresh Listing
              </Button>
              <Button
                variant="outline"
                class="flex w-full flex-row items-center justify-center gap-2 border-[hsl(var(--destructive))] uppercase hover:bg-[hsl(var(--destructive))] hover:text-white"
                disabled={isSubmitting()}
                onClick={abandonListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "abandon"}>
                  <span class="animate-spin">
                    <LoadingIcon className="size-4" />
                  </span>
                </Show>
                Abandon Listing
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Show>
    </Suspense>
  )
}
