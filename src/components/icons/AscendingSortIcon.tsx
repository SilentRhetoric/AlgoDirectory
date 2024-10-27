import { Component } from "solid-js"

interface LoadingIconProps {
  size?: number
  color?: string
  className?: string;
}

const AscendingSortIcon: Component<LoadingIconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
        d="M12 5v14m4-10l-4-4M8 9l4-4"
      />
    </svg>
  )
}

export default AscendingSortIcon
