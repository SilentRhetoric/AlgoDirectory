import { type Table } from "@tanstack/solid-table"
import { createFilter } from "@kobalte/core"
import { createMemo, createSignal, For, onMount, Setter, Show } from "solid-js"
import { generateTagsList } from "@/lib/tag-generator"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CheckIcon from "@/components/icons/CheckIcon"
import { NUM_TAGS_ALLOWED } from "@/lib/constants"
import FilterIcon from "@/components/icons/FilterIcon"
import { Badge } from "@/components/ui/badge"
import { Separator } from "../ui/separator"

type ComboBoxTagProps<TData> = {
  table: Table<TData>
}

const TagsComboBox = <TData,>(props: ComboBoxTagProps<TData>) => {
  let scrollPosition = 0
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
        : [...prev, tagSelected],
    )
    props.table.getColumn("tags")?.setFilterValue(tagsSelected())

    // if it's the last tag removed, clear the filter
    if (tagsSelected().length === 0) {
      props.table.resetColumnFilters()
    }
  }

  const clearAllTags = () => {
    setTagsSelected([])
    props.table.resetColumnFilters()
  }

  // Used to disable scroll restoration
  onMount(() => {
    // Disable scroll restoration
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual"
    }
  })

  const handlePopoverOpen = (isOpen: boolean) => {
    // Store current scroll position
    scrollPosition = window.scrollY

    // Use requestAnimationFrame to ensure scroll position is maintained
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollPosition)
    })

    setOpen(isOpen)
  }

  return (
    <Popover
      open={open()}
      onOpenChange={handlePopoverOpen}
    >
      <PopoverTrigger class="flex h-8 w-full gap-2 [&>svg]:hidden">
        <div
          role="combobox"
          aria-expanded={open()}
          class="flex h-8 w-32 items-center justify-center gap-1 rounded-md border border-input bg-background px-4 py-2 text-sm font-thin transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:w-48"
        >
          <FilterIcon className="size-4" />
          TAGS
          <Show when={tagsSelected().length > 0}>
            <div class="flex flex-row gap-4">
              <Badge class="flex size-4 items-center justify-center rounded-full p-0 leading-[0.93rem]">
                {tagsSelected().length}
              </Badge>
            </div>
          </Show>
        </div>
      </PopoverTrigger>
      <PopoverContent
        class="flex w-48 flex-row p-[1px]"
        showCloseButton={false}
      >
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandItem
            onSelect={clearAllTags}
            class="mx-1 mt-2 flex cursor-pointer flex-row gap-2 px-8"
          >
            <span class="">Clear All Tags</span>
          </CommandItem>
          <Separator class="my-2 w-full overflow-visible" />
          <CommandList>
            <CommandGroup class="flex flex-col justify-center px-0">
              {masterList().map((framework) => (
                <CommandItem
                  value={framework.value}
                  onSelect={handleSelect}
                  class="flex flex-row gap-2"
                >
                  <Show
                    when={tagsSelected().includes(framework.value)}
                    fallback={<span class=""></span>}
                  >
                    <CheckIcon />
                  </Show>
                  <span class="">{framework.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TagsComboBox
