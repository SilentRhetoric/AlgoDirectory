import { A } from "@solidjs/router"

export default function Header() {
  return (
    <nav class="sticky top-0 z-50 flex flex-row items-center gap-4 p-4 font-thin uppercase">
      <A href="/">
        <svg
          viewBox="0 0 507 287"
          version="1.1"
          class="h-8"
        >
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="Group-2"
              transform="translate(-0.0572, -0.5)"
              fill-rule="nonzero"
              fill="currentColor"
            >
              <path
                d="M186.067223,0 L163.227223,0 C157.857223,0 152.907223,2.8619 150.227223,7.5068 L2.02822283,264.507 C-3.73877717,274.507 3.47922283,287 15.0222228,287 L255.467223,287 C265.347223,287 272.527223,277.623 269.947223,268.09 L200.547223,11.0895 C198.787223,4.5457 192.847223,0 186.067223,0 Z"
                id="Path"
              ></path>
              <path
                d="M448.547223,0 L309.557223,0 C301.277223,0 294.557223,6.716 294.557223,15 L294.557223,272 C294.557223,280.284 301.277223,287 309.557223,287 L436.437223,287 C441.777223,287 446.707223,284.166 449.397223,279.558 L504.907223,184.402 C506.927223,180.945 507.477223,176.825 506.437223,172.959 L463.037223,11.115 C461.277223,4.559 455.337223,0 448.547223,0 Z"
                id="Path"
              ></path>
            </g>
          </g>
        </svg>
      </A>
      <div class="grow" />
      <A href="/about">About</A>
      <A href="/manage">Manage</A>
    </nav>
  )
}
