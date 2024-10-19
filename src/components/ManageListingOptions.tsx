import { AlgorandClient } from "@algorandfoundation/algokit-utils"
import { AlgoAmount } from "@algorandfoundation/algokit-utils/types/amount"
import { TransactionSigner } from "algosdk"
import { Component, createComputed, createResource, createSignal, Show, Suspense } from "solid-js"
import { fetchListing } from "~/lib/algod-api"
import { AlgoDirectoryClient } from "~/lib/AlgoDirectoryClient"
import { NfdRecord } from "~/lib/nfd-swagger-codegen"

type ManageListingOptionsProps = {
  segment: NfdRecord
  algorand: AlgorandClient
  typedAppClient: AlgoDirectoryClient
  sender: string
  transactionSigner: TransactionSigner
}

export const ManageListingOptions: Component<{
  segment: NfdRecord
  algorand: AlgorandClient
  typedAppClient: AlgoDirectoryClient
  sender: string
  transactionSigner: TransactionSigner
}> = (props: ManageListingOptionsProps) => {
  const [vouchAmount, setVouchAmount] = createSignal(0.0722) // Each listing requires min 72_200uA
  createComputed(() => {
    console.debug("vouchAmount: ", vouchAmount())
  })

  const [listing] = createResource(async () => {
    const response = await fetchListing(props.segment.appID!)
    return response
  })

  async function createListing() {
    const payTxn = await props.algorand.createTransaction.payment({
      sender: props.sender,
      receiver: props.typedAppClient.appAddress,
      amount: AlgoAmount.Algo(vouchAmount()),
    })
    console.debug("payTxn: ", payTxn)
    const createResult = await props.typedAppClient.send.createListing({
      args: {
        collateralPayment: payTxn,
        nfdAppId: props.segment.appID!,
        listingTags: new Uint8Array(13),
      },
      extraFee: (1000).microAlgo(),
      signer: props.transactionSigner,
      populateAppCallResources: true,
    })
    console.debug("createResult: ", createResult)
  }

  async function refreshListing() {
    const refreshResult = await props.typedAppClient.send.refreshListing({
      args: {
        nfdAppId: props.segment.appID!,
        listingTags: new Uint8Array(13),
      },
      signer: props.transactionSigner,
      populateAppCallResources: true,
    })
    console.debug("refreshResult: ", refreshResult)
  }

  async function abandonListing() {
    const abandonResult = await props.typedAppClient.send.abandonListing({
      args: {
        nfdAppId: props.segment.appID!,
      },
      extraFee: (1000).microAlgo(),
      signer: props.transactionSigner,
      populateAppCallResources: true,
    })
    console.debug("abandonResult: ", abandonResult)
  }

  return (
    <Suspense fallback={<div>Checking for listing</div>}>
      <Show
        when={listing.latest}
        fallback={
          <div>
            <input
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
            <button onClick={createListing}>Create Listing</button>
          </div>
        }
      >
        <div>
          <button onClick={refreshListing}>Refresh Listing</button>
        </div>
        <div>
          <button onClick={abandonListing}>Abandon Listing</button>
        </div>
      </Show>
    </Suspense>
  )
}
