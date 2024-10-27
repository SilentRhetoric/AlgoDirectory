import { Component, JSX } from 'solid-js';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const ArrowLeftCircle: Component<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
      <circle cx="12" cy="12" r="10"/>
      <path d="M16 12H8"/>
      <path d="m12 8-4 4 4 4"/>
    </svg>
  );
};

export default ArrowLeftCircle;