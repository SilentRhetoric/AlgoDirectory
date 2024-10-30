import { Component } from "solid-js"

interface LoadingIconProps {
  size?: number
  color?: string
  className?: string;
}

const LoadingIcon: Component<LoadingIconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={`${className}`}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

export default LoadingIcon
