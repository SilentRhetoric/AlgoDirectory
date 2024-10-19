import { createSignal, For, Show } from 'solid-js';
import { type Table } from '@tanstack/solid-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectTriggerProps } from "@kobalte/core/select";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { generateTagsList } from '@/lib/tag-generator';

type Props<TData> = {
  table: Table<TData>;
};

const TagsSelect = <TData,>(props: Props<TData>) => {
  const [taglist] = createSignal(generateTagsList());
  const filteredStatusList = () =>
    taglist().map((e) => ({
      title: e,
      value: e,
    }));

  return (
    <Select
      onChange={(e) => {
        props.table
          .getColumn("tags")
          ?.setFilterValue(e.length ? e.map((v) => v.value) : undefined);
      }}
      placement="bottom-end"
      sameWidth={true}
      options={filteredStatusList()}
      optionValue="value"
      optionTextValue="title"
      multiple
      itemComponent={(props) => (
        <SelectItem item={props.item} class="capitalize">
          {props.item.rawValue.title}
        </SelectItem>
      )}
  >
      <SelectTrigger
        as={(props: SelectTriggerProps) => (
          <Button
            {...props}
            aria-label="Filter tags"
            variant="outline"
            class="relative flex h-8 w-full gap-2 [&>svg]:hidden"
          >
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mr-2 size-4"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m12 20l-3 1v-8.5L4.52 7.572A2 2 0 0 1 4 6.227V4h16v2.172a2 2 0 0 1-.586 1.414L15 12v1.5m2.001 5.5a2 2 0 1 0 4 0a2 2 0 1 0-4 0m2-3.5V17m0 4v1.5m3.031-5.25l-1.299.75m-3.463 2l-1.3.75m0-3.5l1.3.75m3.463 2l1.3.75"
                />
                <title>Tags</title>
              </svg>
              Tags
            </div>
            <SelectValue<
              ReturnType<typeof filteredStatusList>[0]
            > class="flex h-full items-center gap-1">
              {(state) => (
                <Show
                  when={state.selectedOptions().length <= 2}
                  fallback={
                    <>
                      <Badge class="absolute -top-2 right-0 block size-4 rounded-full p-0 capitalize md:hidden">
                        {state.selectedOptions().length}
                      </Badge>
                      <Badge class="hidden capitalize md:inline-flex py-0 px-1">
                        {state.selectedOptions().length} selected
                      </Badge>
                    </>
                  }
                >
                  <For each={state.selectedOptions()}>
                    {(item) => (
                      <>
                        <Badge class="absolute -top-2 right-0 block size-4 rounded-full p-0 capitalize md:hidden">
                          {state.selectedOptions().length}
                        </Badge>
                        <Badge class="hidden capitalize md:inline-flex py-0 px-1">
                          {item.title}
                        </Badge>
                      </>
                    )}
                  </For>
                </Show>
              )}
            </SelectValue>
          </Button>
        )}
      />
      <SelectContent class='h-96 overflow-auto border p-4'>
        <div>up</div>
      </SelectContent>
    </Select>
  );
}

export default TagsSelect;