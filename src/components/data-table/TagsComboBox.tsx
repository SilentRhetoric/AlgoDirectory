import { type Table } from '@tanstack/solid-table';
import { createFilter } from "@kobalte/core";
import { createMemo, createSignal, For, onMount, Setter, Show } from "solid-js";
import { generateTagsList } from "@/lib/tag-generator"
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import CheckIcon from '@/components/icons/CheckIcon';
import { NUM_TAGS_ALLOWED } from "@/lib/const";
import FilterIcon from '@/components/icons/FilterIcon';
import { Badge } from '@/components/ui/badge';
import { Separator } from '../ui/separator';


type ComboBoxTagProps<TData> = {
  table: Table<TData>;
};

const TagsComboBox = <TData,>(props: ComboBoxTagProps<TData>) => {
  let scrollPosition = 0;
  const [open, setOpen] = createSignal(false)
  const [tagsSelected, setTagsSelected] = createSignal<string[]>([])
  const taglist = createMemo(() => generateTagsList())
  const masterList = () =>
    taglist().map((e) => ({
      title: e,
      value: e,
    }))

  const handleSelect = (tagSelected: string) => {
    setTagsSelected((prev) =>
      prev.includes(tagSelected)
        ? prev.filter((value) => value !== tagSelected)
        : [...prev, tagSelected]
    )
    props.table.getColumn("tags")?.setFilterValue(tagsSelected())
  }

  const clearAllTags = () => {
    setTagsSelected([])
    // props.table.getColumn("tags")?.setFilterValue([])
    props.table.resetColumnFilters()
  }

  // Used to disable scroll restoration
  onMount(() => {
     // Disable scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  });

  const handlePopoverOpen = (isOpen: boolean) => {
    // Store current scroll position
    scrollPosition = window.scrollY;
    
    // Use requestAnimationFrame to ensure scroll position is maintained
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition);
    });
  
    setOpen(isOpen);
  };
  
  return (
    <Popover open={open()} onOpenChange={handlePopoverOpen}>
      <PopoverTrigger
        class="flex h-8 w-full gap-2 [&>svg]:hidden"
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open()}
          class="flex w-32 sm:w-48 h-8 gap-2"
        >
          <FilterIcon className="size-4"/>
          TAGS
          <Show when={tagsSelected().length > 0}>
            <div class="flex flex-row gap-4">
              <Badge class="leading-[0.93rem] flex justify-center items-center size-4 rounded-full p-0">
                {tagsSelected().length}
              </Badge>
            </div>
          </Show>
        </Button>
      </PopoverTrigger>
      <PopoverContent class="flex flex-row w-full sm:w-56 p-[1px]" showCloseButton={false}>
        <Command>
          <CommandInput
            placeholder="Search tags..." 
          />
          <CommandList>
            <CommandGroup class="flex flex-col justify-center">
              <CommandItem
                onSelect={clearAllTags}
                class="flex flex-row gap-2 mt-1 px-8"
              >
                <span class="">Clear All Tags</span>
              </CommandItem>
              <Separator class="my-3" />
              {masterList().map((framework) => (
                <CommandItem
                  value={framework.value}
                  onSelect={handleSelect}
                  class="flex flex-row gap-2"
                >
                  <Show 
                    when={tagsSelected().includes(framework.value)}
                    fallback={<span class="ml-4"></span>}
                  >
                    <CheckIcon />
                  </Show>
                  <span class="">
                    {framework.title}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>  
  );
};

export default TagsComboBox;