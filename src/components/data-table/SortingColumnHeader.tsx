import type { Column } from "@tanstack/solid-table"
import { Match, Show, splitProps, Switch, VoidProps } from "solid-js"

import { Button } from "@/components/ui/button"
import SortIcon from "../icons/SortIcon";
import AscendingSortIcon from "../icons/AscendingSortIcon";
import DescendingSortIcon from "../icons/DescendingSortIcon";

const SortingColumnHeader = <TData, TValue>(
  props: VoidProps<{ column: Column<TData, TValue>; title: string | any }>,
) => {
  const [local] = splitProps(props, ["column", "title"])

  const toggleSorting = () => {
    if (local.column.getIsSorted() === "desc") {
      local.column.clearSorting()
    } else {
      local.column.toggleSorting(local.column.getIsSorted() === "asc", true)
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
        class="flex flex-row gap-1 uppercase"
      >
        {local.title}
        <Switch
          fallback={<SortIcon className="size-3.5" />}
        >
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
