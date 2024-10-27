import { createSignal, onMount, Setter, Show } from "solid-js";
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
import { Button } from "@/components/ui/button";
import CheckIcon from "./icons/CheckIcon";
import { NUM_TAGS_ALLOWED } from "@/lib/const";

type MultiSelectTagsProps = {
  tags: string[];
  masterlist: string[];
  isSubmitting: boolean;
  setTags: Setter<string[]>;
};

function MultiSelectTags(props: MultiSelectTagsProps) {
  let scrollPosition = 0;
  const [open, setOpen] = createSignal(false);

  const masterList = () =>
    props.masterlist.map((e) => ({
      label: e,
      value: e,
    }))

  const handleSelect = (currentValue: string) => {
    // We add the + 1 to the props.tags.length to account for the new tag
    if (props.tags.includes(currentValue) || (props.tags.length + 1) <= NUM_TAGS_ALLOWED) {
      props.setTags((prev) =>
        prev.includes(currentValue)
          ? prev.filter((value) => value !== currentValue)
          : [...prev, currentValue]
      )
    }
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
        disabled={props.isSubmitting}
        class="flex flex-row items-center justify-center w-full"
      >
        <Button
          disabled={props.isSubmitting}
          variant="secondary"
          role="combobox"
          aria-expanded={open()}
          class="flex flex-row items-center justify-center w-full"
        >
          Edit Tags
        </Button>
      </PopoverTrigger>
      <PopoverContent class="flex flex-row w p-[1px]" showCloseButton={false}>
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandGroup>
              {masterList().map((framework) => (
                <CommandItem
                  value={framework.value}
                  onSelect={handleSelect}
                  class="flex flex-row gap-2"
                >
                  <Show 
                    when={props.tags.includes(framework.value)}
                    fallback={<span class="ml-4"></span>}
                  >
                    <CheckIcon />
                  </Show>
                  <span class="">
                    {framework.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>    
  );
}

export default MultiSelectTags;