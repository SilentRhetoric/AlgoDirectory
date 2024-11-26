import { TextField, TextFieldRoot } from "@/components/ui/textfield"
import { type Table } from "@tanstack/solid-table"
import { useNavigate, useSearchParams } from "@solidjs/router"

type Props<TData> = {
  table: Table<TData>
}

const SearchInputField = <TData,>(props: Props<TData>) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const setSearchParams = (value: any) => {
    const sort = searchParams.sort as string
    const columnId = searchParams.column_id as string
    const tags = searchParams.tags as string
    const params = new URLSearchParams()

    console.log(tags)

    // generate search params if they exist
    if (sort && columnId) {
      params.set("column_id", columnId)
      params.set("sort", sort)
    }
    if (tags) params.set("tags", tags)

    // generate search params for name
    if (value) params.set("name", value)
    navigate(`?${params.toString()}`, { replace: true })
    props.table.getColumn("name")?.setFilterValue(value)
  }

  return (
    <TextFieldRoot class="w-full">
      <TextField
        as="input"
        type="text"
        placeholder="Search names..."
        class="flex h-8 max-w-64"
        value={(props.table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onInput={(e) => setSearchParams(e.currentTarget.value)}
      />
    </TextFieldRoot>
  )
}

export default SearchInputField
