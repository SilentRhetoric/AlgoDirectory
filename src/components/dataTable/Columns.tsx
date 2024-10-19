import type { ColumnDef, FilterFn } from "@tanstack/solid-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from "@/components/ui/dropdown-menu";
import { DisplayedListing } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { A } from "@solidjs/router";
import SortingColumnHeader from "./SortingColumnHeader";

// Custom filter function to find tags
const findTagsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const cellValue: string[] = row.getValue(columnId);

  if (Array.isArray(cellValue)) {
    // To match a logical AND use some() to match a logical OR use every()
    const val = filterValue.some((value: string) => cellValue.includes(value));
    return val;
  }
  return false;
};

export const columns: ColumnDef<DisplayedListing>[] = [
  {
    accessorKey: "name",
    header: (props) => (
			<SortingColumnHeader column={props.column} title="Name" />
		),
    cell: (props) => (
      <A href={`/listing/${props.row.original.name}`} class="flex space-x-4" >
        <div>
        <span class="capitalize font-semibold ml-4">{props.row.original.name}</span>
        </div>
      </A>
    )
  },
  {
    accessorKey: "timestamp",
    header: (props) => (
			<SortingColumnHeader column={props.column} title="Last Vouched" />
		),
    cell: (props) => (
      <A href={`/listing/${props.row.original.name}`} class="flex space-x-4" >
        <span class="ml-4">{props.row.original.timestamp}</span>
      </A>
    )
  },
  {
    accessorKey: "amount",
    header: (props) => (
			<SortingColumnHeader column={props.column} title="Rank" />
		),
    cell: (props) => (
      <A href={`/listing/${props.row.original.name}`} class="flex space-x-4" >
        <span class="ml-4">{props.row.original.amount}</span>
      </A>
    )
  },
  {
    accessorKey: "tags",
		header: "Tags",
    filterFn: findTagsFilter,
		cell: (props) => (
			<div class="flex space-x-4">
				<span class="truncate font-medium">
          {props.row.original.tags.map((tag) => (
            <Badge variant="secondary" class="mr-1">
              {tag}
            </Badge>
          ))}
				</span>
			</div>
		),
  },
  {
    id: "actions",
    cell: () => (
      <DropdownMenu placement="bottom-end">
      <DropdownMenuTrigger class="flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24">
          <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
          />
          </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
      </DropdownMenu>
    )
  },

];
