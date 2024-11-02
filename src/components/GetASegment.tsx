import { Component } from "solid-js"
import LinkIcon from "./icons/LinkIcon"

const GetASegment: Component = () => {
  return (
    <a
      href="https://app.testnet.nf.domains/name/directory.algo?view=segments"
      target="_blank"
    >
      <span class="flex flex-row items-center gap-1 text-sm uppercase">
        Get a segment of directory.algo
        <LinkIcon className="size-4" />
      </span>{" "}
    </a>
  )
}

export default GetASegment
