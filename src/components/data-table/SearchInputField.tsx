import { Accessor, Component, createSignal } from 'solid-js';
import { TextField, TextFieldRoot } from '@/components/ui/textfield';
import { type Table } from '@tanstack/solid-table';

type Props<TData> = {
  table: Table<TData>;
};

const SearchInputField = <TData,>(props: Props<TData>) => {
  return (
    <TextFieldRoot>
      <TextField
        type="text"
        placeholder="Search Names..."
        class="h-8 w-64"
        value={(props.table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onInput={(e) =>
          props.table.getColumn("name")?.setFilterValue(e.currentTarget.value)
        }
      />
    </TextFieldRoot>
  );
};

export default SearchInputField;