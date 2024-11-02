import { Component, JSX } from "solid-js"

interface IconProps {
  size?: number
  color?: string
  className?: string
}

const LinkIcon: Component<IconProps> = ({ size = 24, color = "currentColor", className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`${className}`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
      />
    </svg>
  )
}

export default LinkIcon
