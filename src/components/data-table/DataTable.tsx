import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/solid-table"
import {
  flexRender,
  createSolidTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/solid-table"
import { For, Show, splitProps, Accessor, createSignal } from "solid-js"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SearchInputField from "./SearchInputField"
import TagsComboBox from "./TagsComboBox"
import { useNavigate, usePreloadRoute } from "@solidjs/router"
import { Listing } from "@/types/types"
import { useSearchParams } from "@solidjs/router"

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: Accessor<TData[] | undefined>
}

export const DataTable = <TData, TValue>(props: Props<TData, TValue>) => {
  // Get the search parameters
  const [searchParams] = useSearchParams()

  // Sort params
  const sort = searchParams.sort
  const columnId = searchParams.column_id

  // Filter params
  const listingName = searchParams.name
  const tags = searchParams.tags as string

  // Determine if sorting is required else set the default sorting
  const defaultSorting = [{ id: "amount", asc: false, desc: true }]
  if (sort && columnId) {
    defaultSorting[0].id = columnId as string

    // Set the sorting of each column, if its' timestamp reverse the sorting
    // because it sorts on unix timestamps
    if (sort === "asc") {
      defaultSorting[0].asc = true
      defaultSorting[0].desc = false
    } else {
      defaultSorting[0].asc = false
      defaultSorting[0].desc = true
    }
  }

  // Determine the search filter for name and tags
  const filters = []

  if (listingName) {
    filters.push({ id: "name", value: listingName })
  }

  const tagsArr = tags?.split(",") || []

  if (tags) {
    filters.push({ id: "tags", value: tagsArr })
  }

  const navigate = useNavigate()
  const preload = usePreloadRoute()
  const [local] = splitProps(props, ["columns", "data"])

  // Create the table state
  const [sorting, setSorting] = createSignal<SortingState>(defaultSorting)
  const [columnFilters, setColumnFilters] = createSignal<ColumnFiltersState>(filters)
  const [columnVisibility, setColumnVisibility] = createSignal<VisibilityState>({})
  const [hoverTimeout, setHoverTimeout] = createSignal<NodeJS.Timeout | null>(null)

  const table = createSolidTable({
    get data() {
      return local.data() || []
    },
    columns: local.columns,
    state: {
      get sorting() {
        return sorting()
      },
      get columnFilters() {
        return columnFilters()
      },
      get columnVisibility() {
        return columnVisibility()
      },
      get pagination() {
        return {
          pageSize: 10_000,
          pageIndex: 0,
        }
      },
    },
    enableMultiSort: false,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div class="flex w-full flex-col space-y-2.5">
      <div class="flex w-full flex-row items-center justify-between gap-2">
        <div class="flex--row flex w-full items-center justify-start">
          <SearchInputField table={table} />
        </div>
        <div class="w-ful flex items-center sm:w-56">
          <TagsComboBox
            table={table}
            tags={tagsArr}
          />
        </div>
      </div>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <For each={table.getHeaderGroups()}>
              {(headerGroup) => (
                <TableRow>
                  <For each={headerGroup.headers}>
                    {(header) => {
                      return (
                        <TableHead>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    }}
                  </For>
                </TableRow>
              )}
            </For>
          </TableHeader>
          <TableBody>
            <Show
              when={table.getRowModel().rows?.length}
              fallback={
                <TableRow>
                  <TableCell
                    colSpan={local.columns.length}
                    class="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              }
            >
              <For each={table.getRowModel().rows}>
                {(row) => (
                  <TableRow
                    onMouseEnter={() => {
                      const timeout = setTimeout(() => {
                        preload(
                          `/listing/${(row.original as Listing)?.name}?appid=${(row.original as Listing)?.nfdAppID}`,
                          { preloadData: true },
                        )
                      }, 2000)
                      setHoverTimeout(timeout)
                    }}
                    onMouseLeave={() => {
                      const timeout = hoverTimeout()
                      if (timeout) {
                        clearTimeout(timeout)
                        setHoverTimeout(null)
                      }
                    }}
                    onClick={() =>
                      navigate(
                        `/listing/${(row.original as Listing)?.name}?appid=${(row.original as Listing)?.nfdAppID}`,
                      )
                    }
                    data-state={row.getIsSelected() && "selected"}
                    class="cursor-pointer"
                  >
                    <For each={row.getVisibleCells()}>
                      {(cell) => (
                        <TableCell>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      )}
                    </For>
                  </TableRow>
                )}
              </For>
            </Show>
          </TableBody>
        </Table>
      </div>
      {/* <div class="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
        <div class="flex items-center justify-center whitespace-nowrap px-1 text-sm">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div class="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            class="flex size-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m11 7l-5 5l5 5m6-10l-5 5l5 5"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            size="icon"
            class="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m15 6l-6 6l6 6"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            size="icon"
            class="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m9 6l6 6l-6 6"
              />
            </svg>
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            size="icon"
            class="flex size-8"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m7 7l5 5l-5 5m6-10l5 5l-5 5"
              />
            </svg>
          </Button>
        </div>
      </div> */}
    </div>
  )
}
