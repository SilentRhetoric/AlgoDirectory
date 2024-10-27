import { Component } from "solid-js"

interface LoadingIconProps {
  size?: number
  color?: string
  className?: string;
}

const SortIcon: Component<LoadingIconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      class={`${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
      />
    </svg>
  )
}

export default SortIcon
