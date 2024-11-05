import LinkIcon from "./icons/LinkIcon"
import { nfdSiteUrlRoot } from "@/lib/nfd-api"

const GetASegment = () => {
  return (
    <a
      href={`https://app.${nfdSiteUrlRoot}nf.domains/name/directory.algo?view=segments`}
      target="_blank"
    >
      <span class="flex flex-row gap-1 text-sm">
        Get a segment of directory.algo
        <LinkIcon />
      </span>{" "}
    </a>
  )
}

export default GetASegment
