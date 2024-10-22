import { type Table } from '@tanstack/solid-table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTriggerProps } from "@kobalte/core/dropdown-menu";
import { Button } from "@/components/ui/button";
import { For, Match, Switch } from 'solid-js';

type Props<TData> = {
  table: Table<TData>;
};

const ColumnViewDropDown = <TData,>(props: Props<TData>) => {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={(props: DropdownMenuTriggerProps) => (
          <Button
            {...props}
            aria-label="Toggle columns"
            variant="outline"
            class="flex h-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 size-4"
              viewBox="0 0 24 24"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              >
                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0" />
                <path d="M12 18c-3.6 0-6.6-2-9-6c2.4-4 5.4-6 9-6c3.6 0 6.6 2 9 6m-3.999 7a2 2 0 1 0 4 0a2 2 0 1 0-4 0m2-3.5V17m0 4v1.5m3.031-5.25l-1.299.75m-3.463 2l-1.3.75m0-3.5l1.3.75m3.463 2l1.3.75" />
              </g>
              <title>View</title>
            </svg>
            View
          </Button>
        )}
      />
      <DropdownMenuContent>
        <For each={props.table.getAllColumns().filter(column => column.getCanHide())}>
          {item => (
            <DropdownMenuCheckboxItem
              class="capitalize"
              checked={item.getIsVisible()}
              onChange={value => item.toggleVisibility(!!value)}
            >
              <Switch fallback={item.id}>
                <Match when={item.id === 'amount'}>
                  {`rank`}
                </Match>
                <Match when={item.id === 'timestamp'}>
                  {`last vouched`}
                </Match>
                <Match when={item.id === 'tags'}>
                  {`tags`}
                </Match>
              </Switch>
            </DropdownMenuCheckboxItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ColumnViewDropDown;