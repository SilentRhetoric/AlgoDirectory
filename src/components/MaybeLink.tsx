import LinkifyIt from "linkify-it"
import { Component, createMemo } from "solid-js"

type MaybeLinkProps = { content: string | undefined }

const linkify = new LinkifyIt()
linkify.tlds("domains", true)

const MaybeLink: Component<{ content: string | undefined }> = (props: MaybeLinkProps) => {
  const processedContent = createMemo(() => {
    if (props.content == undefined) return []

    const matches = linkify.match(props.content)
    if (!matches) return [{ text: props.content, isLink: false }]

    const result = []
    let lastIndex = 0

    matches.forEach((match) => {
      // Add text before the link if there is any
      if (match.index > lastIndex) {
        result.push({
          text: props.content!.slice(lastIndex, match.index),
          isLink: false,
        })
      }

      // Add the link
      result.push({
        text: match.text,
        url: match.url,
        isLink: true,
      })

      lastIndex = match.lastIndex
    })

    // Add remaining text after last link if any
    if (lastIndex < props.content.length) {
      result.push({
        text: props.content.slice(lastIndex),
        isLink: false,
      })
    }

    return result
  })

  return (
    <span>
      {processedContent().map((segment, index) =>
        segment.isLink ? (
          <a
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-500 no-underline"
          >
            {segment.text}
          </a>
        ) : (
          <span>{segment.text}</span>
        ),
      )}
    </span>
  )
}

export default MaybeLink
