import { A } from "@solidjs/router"
import { NETWORK } from "@/lib/algod-api"

export default function Header() {
  const bannerText = () => {
    switch (NETWORK) {
      case "mainnet":
        return ""
      case "testnet":
        return "Testnet"
      case "betanet":
        return "Betanet"
      default:
        return "Unsupported network"
    }
  }

  return (
    <nav class="sticky top-0 z-50 flex flex-row items-center gap-4 bg-background p-4 uppercase">
      <A href="/">
        <svg
          viewBox="0 0 86 48"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          class="h-8"
        >
          <title>AlgoDirectory Logo</title>
          <g
            id="Page-1"
            stroke="none"
            stroke-width="1"
            fill="none"
            fill-rule="evenodd"
          >
            <g
              id="Group-2"
              transform="translate(0.9428, 0)"
              fill-rule="nonzero"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M31.1192568,1 C31.4603583,1 31.7803428,1.11433077 32.0371606,1.31101458 C32.2935137,1.50734241 32.4869241,1.78576669 32.5755792,2.11539029 L44.1826939,45.0985925 C44.3123881,45.5778078 44.1968019,46.0531153 43.9245861,46.4086124 C43.6522184,46.7643081 43.2231302,47 42.7262254,47 L2.51242751,47 C1.93191351,47 1.46016215,46.6858424 1.20604938,46.2459656 C0.95195422,45.8061194 0.915474631,45.2405597 1.20550317,44.7376491 L25.9912758,1.75525011 C26.1261264,1.52153103 26.318064,1.33263549 26.5438916,1.20223226 C26.7696418,1.07187365 27.0292192,1 27.2993265,1 Z"
                id="Path"
              ></path>
              <path
                d="M75.0183509,1 C75.3597953,1 75.6798779,1.11459825 75.9367338,1.31162745 C76.1937239,1.50875958 76.3874129,1.78838459 76.4758905,2.11796323 L83.7346333,29.1867172 C83.8391049,29.5750702 83.7839327,29.9889596 83.5806439,30.3368658 L74.2968954,46.2511943 C74.0262535,46.7148069 73.5302669,47 72.992985,47 L51.7726366,47 C51.3561735,47 50.9789943,46.8310013 50.7059203,46.5579274 C50.4329203,46.2849273 50.2639258,45.9078356 50.2639258,45.4912892 L50.2639258,2.5087108 C50.2639258,2.09216435 50.4329203,1.71507266 50.7059203,1.44207263 C50.9789943,1.1689987 51.3561735,1 51.7726366,1 Z"
                id="Path"
              ></path>
            </g>
          </g>
        </svg>
      </A>
      <p class="uppercase">{bannerText()}</p>
      <div class="grow"></div>
      <A href="/about">About</A>
      <A href="/manage">Manage</A>
    </nav>
  )
}
