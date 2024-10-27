import { Component, JSX } from 'solid-js';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const AddressIcon: Component<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
      <path d="M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"/>
      <path d="M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2"/>
      <path d="M18 22v-3"/>
      <circle cx="10" cy="10" r="3"/>
    </svg>
  );
};

export default AddressIcon;