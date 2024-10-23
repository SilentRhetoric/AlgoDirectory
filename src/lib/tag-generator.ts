import tagMap from "@/assets/tags.json"; // Adjust the path as necessary

export const generateTagsList = () => {
  const tags = Object.values(tagMap).map((tag) => tag.short);
  return tags;
}