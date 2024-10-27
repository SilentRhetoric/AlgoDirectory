import type { ColumnDef, FilterFn } from "@tanstack/solid-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DisplayedListing } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { A } from "@solidjs/router"
import SortingColumnHeader from "./SortingColumnHeader"

// Custom filter function to find tags
const findTagsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue: string[] = row.getValue(columnId)

  if (Array.isArray(cellValue)) {
    // To match a logical AND use some() to match a logical OR use every()
    const val = filterValue.some((value: string) => cellValue.includes(value))
    return val
  }
  return false
}

export const columns: ColumnDef<DisplayedListing>[] = [
  {
    accessorKey: "name",
    header: (props) => (
      <SortingColumnHeader
        column={props.column}
        title="Name"
      />
    ),
    cell: (props) => (
      <div>
        <span class="ml-4 uppercase">{props.row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    filterFn: findTagsFilter,
    cell: (props) => (
      <div class="flex space-x-4">
        <span class="truncate font-thin">
          {props.row.original.tags.map((tag) => (
            <Badge
              variant="secondary"
              class="mr-1"
            >
              {tag}
            </Badge>
          ))}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: (props) => (
      <SortingColumnHeader
        column={props.column}
        title={
          <div class="flex flex-row gap-1">
            <svg
              viewBox="0 0 240 240"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
                  fill="currentColor"
                >
                  <polygon
                    id="Path"
                    points="238.36 238.68 200.99 238.68 176.72 148.4 124.54 238.69 82.82 238.69 163.47 98.93 150.49 50.41 41.74 238.72 0 238.72 137.82 0 174.36 0 190.36 59.31 228.06 59.31 202.32 104.07"
                  ></polygon>
                </g>
              </g>
            </svg>
            <span class="uppercase">Value</span>
          </div>
        }
      />
    ),
    cell: (props) => (
      <span class="ml-4">{props.row.original.amount}</span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: (props) => (
      <SortingColumnHeader
        column={props.column}
        title="Updated"
      />
    ),
    cell: (props) => (
      <span class="ml-4">{props.row.original.timestamp}</span>
    ),
  },

  // {
  //   id: "actions",
  //   cell: () => (
  //     <DropdownMenu placement="bottom-end">
  //       <DropdownMenuTrigger class="flex items-center justify-center">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           class="size-4"
  //           viewBox="0 0 24 24"
  //         >
  //           <path
  //             fill="none"
  //             stroke="currentColor"
  //             stroke-linecap="round"
  //             stroke-linejoin="round"
  //             stroke-width="2"
  //             d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
  //           />
  //         </svg>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent>
  //         <DropdownMenuItem>Edit</DropdownMenuItem>
  //         <DropdownMenuItem>Delete</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  // },
]
