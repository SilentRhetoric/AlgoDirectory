import { Component } from 'solid-js';

const PlusIcon: Component = () => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      class="size-4" 
      viewBox="0 0 24 24">
      <path 
        fill="none" 
        stroke="currentColor"
         stroke-linecap="round" 
         stroke-linejoin="round" 
         stroke-width="2" 
         d="M12 5v14m-7-7h14">
      </path>
    </svg>
  )
};

export default PlusIcon;