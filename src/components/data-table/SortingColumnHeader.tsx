import type { Column } from "@tanstack/solid-table"
import { Match, Show, splitProps, Switch, VoidProps } from "solid-js"

import { Button } from "@/components/ui/button"

const SortingColumnHeader = <TData, TValue>(
  props: VoidProps<{ column: Column<TData, TValue>; title: string | any }>,
) => {
  const [local] = splitProps(props, ["column", "title"])

  return (
    <Show
      when={local.column.getCanSort() && local.column.getCanHide()}
      fallback={<span class="text-sm font-thin uppercase">{local.title}</span>}
    >
      <Button
        variant="ghost"
        onClick={() => local.column.toggleSorting(local.column.getIsSorted() === "asc", true)}
        class="flex flex-row gap-1 uppercase"
      >
        {local.title}
        <Switch
          fallback={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
              />
            </svg>
          }
        >
          <Match when={local.column.getIsSorted() === "asc"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m4-10l-4-4M8 9l4-4"
              />
            </svg>
          </Match>
          <Match when={local.column.getIsSorted() === "desc"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="size-3.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 5v14m4-4l-4 4m-4-4l4 4"
              />
            </svg>
          </Match>
        </Switch>
      </Button>
    </Show>
  )
}

export default SortingColumnHeader
