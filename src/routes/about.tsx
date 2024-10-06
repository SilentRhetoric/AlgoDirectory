import SiteTitle from "~/components/SiteTitle"

export default function About() {
  return (
    <main class="prose mx-auto p-4">
      <SiteTitle>About</SiteTitle>
      <h1 class="font-thin uppercase sm:text-5xl">About AlgoDirectory</h1>
      <h2 class="font-thin">Overview</h2>
      <p>
        AlgoDirectory is like a traditional directory, but the data lives on the Algorand blockchain
        and uses a novel smart contract protocol to incentivize the maintenance of its data by
        listing owners.
      </p>
      <p>
        This directory aims to be best first stop new users in Algorand ecosystem, a valuable
        reference guide for existing Algorand enthusiasts, and the premier place for projects to be
        listed and discovered.
      </p>
      <p>
        To create a listing in AlgoDirectory, first{" "}
        <a
          href="https://app.nf.domains/name/directory.algo?view=segments"
          target="_blank"
          class="font-thin"
        >
          mint a segment
        </a>{" "}
        of directory.algo at NFDomains, then return to this site and click "Manage" to be guided
        through the listing process.
      </p>
      <h2 class="font-thin">History</h2>
      <p>
        AlgoDirectory is the spiritual successor to directorydotalgo.xyz, a “Web2” directory site
        created and maintained by a generous individual until it became clear that a hand-curated
        model was unsustainable, the effort to maintain the listings was abandoned, and the site
        hosting was allowed to expire.
      </p>
      <p>
        This was one of several Web2 directories that have been created throughout Algorand's
        history. Others have included Algo Tables, AlgoAdoption, Algo Curator, Into The Algoverse,
        Awesome Algorand, and multiple subsites created by the Algorand Foundation.
      </p>
      <p>
        Following the news that directorydotalgo.xyz was shutting down, we endeavored to pick up the
        torch, take a new approach, and submit an xGov proposal to build AlgoDirectory. We remain
        grateful to the community for approving that grant and hope the AlgoDirectory can continue
        to give back to the community for many moons.
      </p>
      <h2 class="font-thin">Guiding Principles</h2>
      <p>AlgoDirectory improves upon previous Algorand directories in three key ways:</p>
      <ol>
        <li>
          <p class="font-thin">Decentralized, Permissionless, Permanent</p>
          <p>
            AlgoDirectory leverages Algorand’s powerful on-chain capabilties to provide a directory
            that applies the values we love about Algorand to the Directory itself. It is
            decentralized across the node network, open to anyone through a permissionless smart
            contract, and permanent for the lifetime of the chain.
          </p>
        </li>
        <li>
          <p class="font-thin">Designed for Quality and Freshness</p>
          <p>
            A central challenge with directories is keeping their information up to date so it is
            useful to people. AlgoDirectory uses a novel Vouching Protocol to automate the process
            of determining if listings are still valid and actively maintained. Listing owners
            effectively vouch for their listings by providing collateral as a guarantee and
            interacting with their listings regularly. This system provides on-chain data about
            whether someone stands behind a listing and how long it has been since someone refreshed
            a listing. This way, listings can be automatically sorted and filtered so that active
            listings people are standing behind get the visibility they deserve while stale ones or
            ones that have been abandoned are discoverable but de-emphasized.
          </p>
        </li>
        <li>
          <p class="font-thin">Sustainable for the Long Term</p>
          <p>
            Another key objective of AlgoDirectory is to be sustainable so that it outlasts the
            efforts of its creators and any centralized website hosting. Algorand has had several
            directories over the years, some of which are now gone because their creators are no
            longer curating them and their Web2 sites. By putting the Directory on chain and
            providing open source code for the web app to interact with it, listings on
            AlgoDirectory will always be accessible.
          </p>
        </li>
      </ol>
      <h2 class="font-thin">Technical Design</h2>
      <p>
        The main technical approach to AlgoDirectory is a wrapper around NFDs. In particular,
        AlgoDirectory extends existing metadata functionality provided by segments of the
        directory.algo NFD and indexes listings on chain to display them in the web app. This
        enables a robust, on-chain data management process and interoperability with other parts of
        the Algorand ecosystem that have integrated with NFDomains.
      </p>
      <p>
        AlgoDirectory does utilize NFD’s API for implementation convenience, so there is some
        technical dependency on NFD, but decentralization absolutists should note that all of the
        data management occurs on-chain, the smart contracts are permissionless and can be locked
        for immutability, and and the Directory could be enhanced in the future to read NFD metadata
        directly from the chain. I think this is a reasonable and practical approach to
        bootstrapping an on-chain directory.
      </p>
      <p>
        The Directory is designed to operate at cost and not intended to generate profit for the
        AlgoDirectory team, so there is no markup above NFD's minimum cost to mint segments of
        directory.algo.
      </p>
      <h2 class="font-thin">Disclaimer</h2>
      <p>
        Use at your own risk. Always verify in your wallet that each transaction is what you
        expected before signing. Once collateral is sent to the smart contract to create a listing,
        the collateral can only be returned to that account when the listing is abandoned. This
        software is provided under MIT license, and the source code is available through the GitHub
        link in the page footer.
      </p>
      <h2 class="font-thin">App Info</h2>
      <p>
        Wallet interfaces provided by{" "}
        <a
          href="https://github.com/TxnLab/use-wallet"
          target="_blank"
          class="font-thin"
        >
          use-wallet
        </a>
        . Support Free Open Source Software (FOSS) with code contributions or sponsorship!
      </p>
      <p>Version 0.0.1</p>
    </main>
  )
}
