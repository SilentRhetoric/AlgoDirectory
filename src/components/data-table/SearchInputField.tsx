import { TextField, TextFieldRoot } from "@/components/ui/textfield"
import { type Table } from "@tanstack/solid-table"

type Props<TData> = {
  table: Table<TData>
}

const SearchInputField = <TData,>(props: Props<TData>) => {
  return (
    <TextFieldRoot class="w-full">
      <TextField
        as="input"
        type="text"
        placeholder="Search names..."
        class="flex h-8 w-full sm:w-64"
        value={(props.table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onInput={(e) => props.table.getColumn("name")?.setFilterValue(e.currentTarget.value)}
      />
    </TextFieldRoot>
  )
}

export default SearchInputField
