import tagJSON from "@/assets/tags.json" // Adjust the path as necessary

export const generateTagsList = () => {
  const tags = Object.values(tagJSON).map((tag) => tag.short)
  return tags
}

export const sortedTagsList = generateTagsList().sort()

export const generateTagsMap = () => {
  const tags = new Map(Object.entries(tagJSON).map(([key, value]) => [value.short, key]))
  return tags
}
