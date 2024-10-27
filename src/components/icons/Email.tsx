import { Component, JSX } from 'solid-js';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const Email: Component<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
      <rect 
        width="20" 
        height="16" 
        x="2" 
        y="4" 
        rx="2"
      />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
};

export default Email;