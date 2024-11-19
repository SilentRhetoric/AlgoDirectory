import type { Column } from "@tanstack/solid-table"
import { Match, Show, splitProps, Switch, VoidProps } from "solid-js"

import { Button } from "@/components/ui/button"
import SortIcon from "../icons/SortIcon"
import AscendingSortIcon from "../icons/AscendingSortIcon"
import DescendingSortIcon from "../icons/DescendingSortIcon"
import { useSearchParams, useNavigate } from "@solidjs/router"

const SortingColumnHeader = <TData, TValue>(
  props: VoidProps<{ column: Column<TData, TValue>; title: string | any }>,
) => {
  const [local] = splitProps(props, ["column", "title"])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const toggleSorting = () => {
    // generate search params for previous search
    const params = new URLSearchParams()
    const name = searchParams.name as string
    const tags = searchParams.tags as string

    if (name) params.set("name", name)
    if (tags) params.set("tags", tags)

    const column = local.column.id
    const nextSortingOrder = local.column.getNextSortingOrder()

    if (nextSortingOrder) {
      // The following is to take into account the timestamp column and how it sorts in reverse
      const sortOrder = nextSortingOrder === "asc" ? "asc" : "desc"
      console.log(sortOrder + " " + column)
      params.set("column_id", column)
      params.set("sort", sortOrder)
    }
    navigate(`?${params.toString()}`, { replace: true })

    if (local.column.getNextSortingOrder() === false) {
      local.column.clearSorting()
    } else {
      local.column.toggleSorting(nextSortingOrder === "desc", false)
    }
  }

  return (
    <Show
      when={local.column.getCanSort() && local.column.getCanHide()}
      fallback={<span class="text-sm font-thin uppercase">{local.title}</span>}
    >
      <Button
        variant="ghost"
        onClick={() => toggleSorting()}
        class="flex flex-row gap-1 px-0 uppercase hover:bg-transparent"
      >
        {local.title}
        <Switch fallback={<SortIcon className="size-3.5" />}>
          <Match when={local.column.getIsSorted() === "asc"}>
            <AscendingSortIcon className="size-3.5" />
          </Match>
          <Match when={local.column.getIsSorted() === "desc"}>
            <DescendingSortIcon className="size-3.5" />
          </Match>
        </Switch>
      </Button>
    </Show>
  )
}

export default SortingColumnHeader
