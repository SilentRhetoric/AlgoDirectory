import { Component } from "solid-js"
import { Listing } from "~/types/listing-types"

import { formatDistanceToNow } from "date-fns"
import { microAlgo } from "@algorandfoundation/algokit-utils"
import { A } from "@solidjs/router"

function formatTimestamp(timestamp: bigint) {
  // Convert the Unix timestamp to milliseconds
  const date = new Date(Number(timestamp) * 1000)

  // Use formatDistanceToNow to get the relative time
  return formatDistanceToNow(date, { addSuffix: true })
}

type ListingCardProps = { listing: Listing }

export const ListingCard: Component<{ listing: Listing }> = (props: ListingCardProps) => {
  return (
    <A href={`/listing/${props.listing.name}`}>
      <div class="flex flex-row items-baseline gap-4 font-thin">
        <p class="text-xl uppercase">{props.listing.name}</p>
        <div class="flex flex-row items-center gap-1">
          <p>Vouched</p>
          <svg
            viewBox="0 0 240 240"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            class="fill-primary h-4 w-4"
          >
            <g
              id="Page-1"
              stroke="none"
              stroke-width="1"
              fill-rule="evenodd"
            >
              <g
                id="algorand_logo_mark_black"
                transform="translate(0.82, 0.64)"
                fill-rule="nonzero"
              >
                <polygon
                  id="Path"
                  points="238.36 238.68 200.99 238.68 176.72 148.4 124.54 238.69 82.82 238.69 163.47 98.93 150.49 50.41 41.74 238.72 0 238.72 137.82 0 174.36 0 190.36 59.31 228.06 59.31 202.32 104.07"
                ></polygon>
              </g>
            </g>
          </svg>
          <p>{microAlgo(props.listing.vouchAmount).algo}</p>
        </div>
        <p>Listed {formatTimestamp(props.listing.timestamp)}</p>
        {/* <p>Tags: {props.listing.tags}</p> */}
      </div>
    </A>
  )
}
