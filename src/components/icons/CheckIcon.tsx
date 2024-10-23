import { Component, JSX } from 'solid-js';

const CheckIcon: Component = () => {

  return (
    <svg xmlns="http://www.w3.org/2000/svg" 
      class={`h-4 w-4`}
      viewBox={`0 0 24 24`}>
      <path 
        fill="none"
        stroke="currentColor"
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="m5 12l5 5L20 7">
      </path>
    </svg>
  );
};

export default CheckIcon;