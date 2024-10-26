import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import { TransactionSigner } from "algosdk"
import { Component, createMemo, createResource, createSignal, Show, Suspense } from "solid-js"
import { algorand, APP_ID, fetchListing } from "@/lib/algod-api"
import { NfdRecord } from "@/lib/nfd-swagger-codegen"
import { formatTimestamp } from "@/lib/utilities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import MultiSelectTags from "./MultiSelectTags"
import { generateTagsList } from "@/lib/tag-generator"
import AlgorandLogo from "./icons/AlgorandLogo"
import LoadingIcon from "./icons/LoadingIcon"
import { AlgoDirectoryClient } from "@/lib/AlgoDirectoryClient"

type ManageSingleListingProps = {
  segment: NfdRecord
  sender: string
  transactionSigner: TransactionSigner
}

type TypeSubmitting = "create" | "refresh" | "abandon"

export const ManageSingleListing: Component<{
  segment: NfdRecord
  sender: string
  transactionSigner: TransactionSigner
}> = (props: ManageSingleListingProps) => {
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [typeSubmitting, setTypeSubmitting] = createSignal<TypeSubmitting>()
  const [vouchAmount, setVouchAmount] = createSignal(0.0722) // Each listing requires min 72_200uA
  const [tags, setTags] = createSignal<string[]>([])
  const tagMasterlist = createMemo(() => generateTagsList())

  const typedAppClient = algorand.client.getTypedAppClientById(AlgoDirectoryClient, {
    appId: BigInt(APP_ID),
    defaultSender: props.sender,
  })

  // Fetch the listing data for this segment
  const [listing, { refetch }] = createResource(async () => {
    try {
      const response = await fetchListing(props.segment.appID!)
      // Update tags from Uint8Array to string[]
      setTags(
        Array.from(response?.tags || [])
          .slice(0, 5)
          .filter((tag: number) => tag !== 0)
          .map((tag: number) => {
            return tagMasterlist()[(tag - 1).toString() as keyof typeof tagMasterlist]
          }),
      )

      // Update vouch amount
      setVouchAmount(Number((Number(response?.vouchAmount) * 1e-6).toFixed(4)))
      return response
    } catch (error: any) {
      if (error?.message.includes("box not found")) {
        console.warn(`No box data for: \n${props.segment.appID} - (${props.segment.name})`)
      } else {
        console.error("Error fetching listing: ", error?.message)
      }
      return null
    }
  })

  const getUInt8Tags = () => {
    // const vouchAmt = BigInt(vouchAmount() * 1e6)
    const newTags = new Uint8Array(13)

    // Convert tags to ints, but making sure to add 1 to each index looked up
    const uInt8Tags = tags().map((tag: string) => tagMasterlist().indexOf(tag) + 1)
    newTags.set(uInt8Tags)
    return newTags
  }

  async function createListing() {
    setIsSubmitting(true)
    setTypeSubmitting("create")
    const newTags = getUInt8Tags()
    const payTxn = await algorand.createTransaction.payment({
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
        // Using h-96 to emulate the cards height
        <div class="flex h-96 w-full items-center justify-center">
          <span class="animate-spin">
            <LoadingIcon />
          </span>
        </div>
      }
    >
      <Show
        when={listing.latest}
        fallback={
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{props.segment.name}</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col space-y-3">
              <div class="flex flex-row items-center justify-between">
                <label class="">Vouch Amount:</label>
                <div class="flex flex-row items-center gap-1">
                  <input
                    disabled={isSubmitting()}
                    class="h-8 w-32 rounded-md border bg-secondary p-4"
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
              <div class="flex h-14 flex-wrap items-center justify-start gap-2">
                {tags().map((tag: string) => (
                  <Badge>{tag}</Badge>
                ))}
              </div>
              <MultiSelectTags
                tags={tags()}
                masterlist={tagMasterlist()}
                isSubmitting={isSubmitting()}
                setTags={setTags}
              />
            </CardContent>
            <div class="px-6">
              <div class="-mx-6 mb-6 h-px bg-border" />
            </div>
            <CardFooter>
              <Button
                disabled={isSubmitting()}
                onClick={createListing}
                class="flex w-full flex-row items-center justify-center gap-2"
              >
                <Show when={isSubmitting() && typeSubmitting() === "create"}>
                  <span class="animate-spin">
                    <LoadingIcon />
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
            <CardTitle class="text-base">{props.segment.name}</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-col space-y-3">
            <div class="flex flex-row justify-between">
              <span>{`Updated: `}</span>
              <span>{`${listing()?.timestamp ? formatTimestamp(listing()!.timestamp) : ""}`}</span>
            </div>
            <div class="flex flex-row items-center justify-between">
              <label class="">Vouch Amount:</label>
              <div class="flex flex-row items-center gap-1">
                <span>{vouchAmount()}</span>
                {/* <input
                  class="w-32 h-8 border rounded-md p-4 bg-secondary"
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
                /> */}
                <AlgorandLogo />
              </div>
            </div>
            <div class="flex h-14 flex-wrap items-center justify-start gap-2">
              {tags().map((tag: string) => (
                <Badge variant="secondary">{tag}</Badge>
              ))}
            </div>
            <MultiSelectTags
              tags={tags()}
              masterlist={tagMasterlist()}
              isSubmitting={isSubmitting()}
              setTags={setTags}
            />
          </CardContent>
          <div class="px-6">
            <div class="-mx-6 mb-6 h-px bg-border" />
          </div>
          <CardFooter>
            <div class="flex w-full flex-col items-center justify-start space-y-2">
              <Button
                variant="secondary"
                class="flex w-full flex-row items-center justify-center gap-2"
                disabled={isSubmitting()}
                onClick={refreshListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "refresh"}>
                  <span class="animate-spin">
                    <LoadingIcon />
                  </span>
                </Show>
                Refresh Listing
              </Button>
              <Button
                variant="destructive"
                class="flex w-full flex-row items-center justify-center gap-2"
                disabled={isSubmitting()}
                onClick={abandonListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "abandon"}>
                  <span class="animate-spin">
                    <LoadingIcon />
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
