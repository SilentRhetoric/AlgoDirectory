import { AlgorandClient, microAlgo } from "@algorandfoundation/algokit-utils"
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import { TransactionSigner } from "algosdk"
import { Component, createComputed, createMemo, createResource, createSignal, Show, Suspense } from "solid-js"
import { fetchListing } from "@/lib/algod-api"
import { AlgoDirectoryClient } from "@/lib/AlgoDirectoryClient"
import { NfdRecord } from "@/lib/nfd-swagger-codegen"
import { formatTimestamp } from "@/lib/utilities"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
	NumberField,
	NumberFieldDecrementTrigger,
	NumberFieldGroup,
	NumberFieldIncrementTrigger,
	NumberFieldInput,
} from "@/components/ui/number-field"
import { Separator } from "@/components/ui/separator";
import { Badge } from "./ui/badge"
import MultiSelectTags from "./MultiSelectTags"
import { generateTagsList } from "@/lib/tag-generator"
import AlgorandLogo from "./icons/AlgorandLogo"
import LoadingIcon from "./icons/LoadingIcon"
import { set } from "date-fns"

type ManageSingleListingProps = {
  segment: NfdRecord
  algorand: AlgorandClient
  typedAppClient: AlgoDirectoryClient
  sender: string
  transactionSigner: TransactionSigner
}

type TypeSubmitting = "create" | "refresh" | "abandon"

export const ManageSingleListing: Component<{
  segment: NfdRecord
  algorand: AlgorandClient
  typedAppClient: AlgoDirectoryClient
  sender: string
  transactionSigner: TransactionSigner
}> = (props: ManageSingleListingProps) => {
  const [isSubmitting, setIsSubmitting] = createSignal(false)
  const [typeSubmitting, setTypeSubmitting] = createSignal<TypeSubmitting>()
  const [vouchAmount, setVouchAmount] = createSignal(0.0722) // Each listing requires min 72_200uA
  const [tags, setTags] = createSignal<string[]>([])
  const tagMasterlist = createMemo(() => generateTagsList())
  createComputed(() => {
    console.debug("vouchAmount: ", vouchAmount())
  })

  // Fetch the listing data for this segment
  const [listing, { refetch }] = createResource(async () => {
    try {
      const response = await fetchListing(props.segment.appID!)
      // Update tags from Uint8Array to string[]
      setTags(Array.from(response?.tags || [])
        .slice(0, 5)
        .filter((tag: number) => tag !== 0)
        .map((tag: number) => {
          return tagMasterlist()[(tag - 1).toString() as keyof typeof tagMasterlist]
      }))

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
    const newTags = getUInt8Tags();
    const payTxn = await props.algorand.createTransaction.payment({
      sender: props.sender,
      receiver: props.typedAppClient.appAddress,
      amount: AlgoAmount.Algo(vouchAmount()),
    })
    console.debug("payTxn: ", payTxn)
    try {
      const createResult = await props.typedAppClient.send.createListing({
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
    const newTags = getUInt8Tags();
    try {
      const refreshResult = await props.typedAppClient.send.refreshListing({
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
      const abandonResult = await props.typedAppClient.send.abandonListing({
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
    <Suspense fallback={<div>Checking for listing</div>}>
      <Show
        when={listing.latest}
        fallback={
          <Card>
            <CardHeader>
              <CardTitle class="text-base">{props.segment.name}</CardTitle>
            </CardHeader>
            <CardContent class="flex flex-col space-y-3">
              <div class="flex flex-row justify-between items-center">
                <label class="">Vouch Amount:</label>
                <div class="flex flex-row items-center gap-1">
                  <input
                    disabled={isSubmitting()}
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
                  />
                  <AlgorandLogo />
                </div>
              </div>
              <div class="flex flex-wrap gap-2 justify-start items-center h-14">
                {tags().map((tag: string) => (
                  <Badge>
                    {tag}
                  </Badge>
                ))}
            </div>
              <MultiSelectTags tags={tags()} masterlist={tagMasterlist()} isSubmitting={isSubmitting()} setTags={setTags}/>
            </CardContent>
            <div class="px-6">
              <div class="h-px bg-border -mx-6 mb-6" />
            </div>
            <CardFooter>
              <Button
                disabled={isSubmitting()}
                onClick={createListing}
                class="w-full flex flex-row justify-center items-center gap-2"
              >
                <Show when={isSubmitting() && typeSubmitting() === "create"}>
                  <span class="animate-spin"><LoadingIcon /></span>
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
            <div class="flex flex-row justify-between items-center">
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
            <div class="flex flex-wrap gap-2 justify-start items-center h-14">
              {tags().map((tag: string) => (
                <Badge variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <MultiSelectTags tags={tags()} masterlist={tagMasterlist()} isSubmitting={isSubmitting()} setTags={setTags}/>
          </CardContent>
          <div class="px-6">
            <div class="h-px bg-border -mx-6 mb-6" />
          </div>
          <CardFooter>
            <div class="flex flex-col justify-start items-center w-full space-y-2">
              <Button
                variant="secondary"
                class="w-full flex flex-row justify-center items-center gap-2"
                disabled={isSubmitting()}
                onClick={refreshListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "refresh"}>
                  <span class="animate-spin"><LoadingIcon /></span>
                </Show>
                Refresh Listing
              </Button>
              <Button
                variant="destructive"
                class="w-full flex flex-row justify-center items-center gap-2"
                disabled={isSubmitting()}
                onClick={abandonListing}
              >
                <Show when={isSubmitting() && typeSubmitting() === "abandon"}>
                  <span class="animate-spin"><LoadingIcon /></span>
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
