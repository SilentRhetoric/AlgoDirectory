import { type Table } from '@tanstack/solid-table';
import { createFilter } from "@kobalte/core";
import { createSignal } from "solid-js";
import {
  Combobox,
  ComboboxItem,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput
} from "@/components/ui/combobox";

type Props<TData> = {
  table: Table<TData>;
};

const TagsComboBox = <TData,>(props: Props<TData>) => {
  const ALL_OPTIONS = ["Apple", "Banana", "Blueberry", "Grapes", "Pineapple"];
 
  const filter = createFilter({ sensitivity: "base" });
  const [options, setOptions] = createSignal(ALL_OPTIONS);
  const onInputChange = (value: string) => {
    setOptions(ALL_OPTIONS.filter(option => filter.contains(option, value)));
  };
  return (
    <Combobox
      options={options()}
      onInputChange={onInputChange}
      itemComponent={props => <ComboboxItem item={props.item}>{props.item.rawValue}</ComboboxItem>}
    >
      <ComboboxTrigger>
        <ComboboxInput />
      </ComboboxTrigger>
      <ComboboxContent />
    </Combobox>
  );
};

export default TagsComboBox;