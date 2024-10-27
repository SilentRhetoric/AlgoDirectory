import { Component, JSX } from 'solid-js';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const NoteBookIcon: Component<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
      <path 
        d="M2 6h4"/>
      <path 
        d="M2 10h4"/>
      <path 
        d="M2 14h4"/>
      <path 
        d="M2 18h4"/>
      <rect 
        width="16" 
        height="20" 
        x="4" 
        y="2" 
        rx="2"
      />
      <path d="M16 2v20"/>
    </svg>
  );
};

export default NoteBookIcon;