import { Component, JSX } from 'solid-js';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

const TwitterIcon: Component<IconProps> = ({ size = 24, color = 'currentColor', className = '' }) => {
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
};

export default TwitterIcon;