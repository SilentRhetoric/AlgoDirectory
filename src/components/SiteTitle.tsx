import { Title } from "@solidjs/meta"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SiteTitle(props: any) {
  return <Title>{props.children} | AlgoDirectory</Title>
}
