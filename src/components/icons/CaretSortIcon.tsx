import { Component, JSX } from 'solid-js';

interface IconProps extends JSX.HTMLAttributes<SVGSVGElement> {
    size?: number;
    color?: string;
}

const CaretSortIcon: Component<IconProps> = (props) => {
  const { size = 24, color = 'currentColor', ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-3.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m8 9l4-4l4 4m0 6l-4 4l-4-4"
      />
    </svg>
  );
};

export default CaretSortIcon;