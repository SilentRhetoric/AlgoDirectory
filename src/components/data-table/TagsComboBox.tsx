import { type Table } from "@tanstack/solid-table"
import { useSearchParams, useNavigate } from "@solidjs/router"
import { createMemo, createSignal, onMount, Show } from "solid-js"
import { sortedTagsList } from "@/lib/tag-generator"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CheckIcon from "@/components/icons/CheckIcon"
import FilterIcon from "@/components/icons/FilterIcon"
import { Badge } from "@/components/ui/badge"
import { Separator } from "../ui/separator"

type ComboBoxTagProps<TData> = {
  table: Table<TData>
  tags: string[]
}

const TagsComboBox = <TData,>(props: ComboBoxTagProps<TData>) => {
  let scrollPosition = 0
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sortedMasterTagList = createMemo(() => sortedTagsList)
  const [open, setOpen] = createSignal(false)
  const [tagsSelected, setTagsSelected] = createSignal<string[]>(props.tags)
  const masterList = () =>
    sortedMasterTagList().map((e) => ({
      title: e,
      value: e,
    }))

  const getSearchParams = () => {
    // get previous search params if they exist
    const params = new URLSearchParams()
    const name = searchParams.name as string
    const sort = searchParams.sort as string
    const columnId = searchParams.column_id as string

    if (name) params.set("name", name)
    if (sort && columnId) {
      params.set("column_id", columnId)
      params.set("sort", sort)
    }

    // generate search params for tags
    const tags = tagsSelected().join(",")
    params.set("tags", tags)
    return params
  }

  const handleSelect = (tagSelected: string) => {
    setTagsSelected((prev) =>
      prev.includes(tagSelected)
        ? prev.filter((value) => value !== tagSelected)
        : [...prev, tagSelected],
    )
    props.table.getColumn("tags")?.setFilterValue(tagsSelected())

    // generate search params for tags
    const params = getSearchParams()
    navigate(`?${params.toString()}`, { replace: true })

    // if it's the last tag removed, clear the filter
    if (tagsSelected().length === 0) {
      props.table.resetColumnFilters()
    }
  }

  const clearAllTags = () => {
    // clear all tags params
    const params = getSearchParams()
    params.delete("tags")
    navigate(`?${params.toString()}`, { replace: true })

    // clear the tags selected
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
          aria-label="Select Tags"
          aria-expanded={open()}
          class="flex h-8 w-32 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-thin transition-[color,background-color,box-shadow] hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:w-48"
        >
          <FilterIcon className="size-3.5" />
          TAGS
          <Show when={tagsSelected().length > 0}>
            <div class="flex flex-row gap-5">
              <Badge
                variant="outline"
                class="flex size-4 items-center justify-center rounded-full p-0 leading-[0.93rem]"
              >
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
            <span class="font-thin">Clear All Tags</span>
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
                  <span class="font-thin">{framework.title}</span>
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
