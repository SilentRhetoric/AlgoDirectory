import nodely from "../assets/nodely.png"

export default function Footer() {
  return (
    <footer class="flex w-full flex-row justify-around p-4 pt-16 md:justify-center md:gap-4">
      <a
        href="https://x.com/algodirectory"
        target="_blank"
        class="flex flex-row items-center"
      >
        <svg
          viewBox="0 0 24 24"
          class="h-5 w-5"
          fill="currentColor"
        >
          <g>
            <path d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0" />
          </g>
        </svg>
        <p class="ml-2 hidden text-xs sm:inline md:text-sm">Follow @AlgoDirectory</p>
      </a>
      <a
        href="https://github.com/SilentRhetoric/AlgoDirectory"
        aria-label="Contribute to this open source project"
        target="_blank"
        class="flex flex-row items-center"
      >
        <svg
          width="25"
          height="24"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M12.846 0c-6.63 0-12 5.506-12 12.303 0 5.445 3.435 10.043 8.205 11.674.6.107.825-.262.825-.585 0-.292-.015-1.261-.015-2.291-3.015.569-3.795-.754-4.035-1.446-.135-.354-.72-1.446-1.23-1.738-.42-.23-1.02-.8-.015-.815.945-.015 1.62.892 1.845 1.261 1.08 1.86 2.805 1.338 3.495 1.015.105-.8.42-1.338.765-1.645-2.67-.308-5.46-1.37-5.46-6.075 0-1.338.465-2.446 1.23-3.307-.12-.308-.54-1.569.12-3.26 0 0 1.005-.323 3.3 1.26.96-.276 1.98-.415 3-.415s2.04.139 3 .416c2.295-1.6 3.3-1.261 3.3-1.261.66 1.691.24 2.952.12 3.26.765.861 1.23 1.953 1.23 3.307 0 4.721-2.805 5.767-5.475 6.075.435.384.81 1.122.81 2.276 0 1.645-.015 2.968-.015 3.383 0 .323.225.707.825.585a12.047 12.047 0 0 0 5.919-4.489 12.537 12.537 0 0 0 2.256-7.184c0-6.798-5.37-12.304-12-12.304Z"
          />
        </svg>
        <p class="ml-2 flex hidden text-sm sm:inline">Contribute to this open source project</p>
      </a>
      <a
        href="https://nodely.io/"
        target="_blank"
        class="flex flex-row items-center"
      >
        <img
          src={nodely}
          alt="Nodely"
          class="h-6 w-6"
        />
        <p class="ml-2 hidden text-sm sm:inline">Powered by Nodely</p>
      </a>
    </footer>
  )
}
