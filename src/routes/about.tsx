import SiteTitle from "@/components/SiteTitle"

export default function About() {
  return (
    <main class="mx-auto flex flex-col gap-2 p-4">
      <SiteTitle>About</SiteTitle>
      <h1 class="font-thin uppercase">About AlgoDirectory</h1>
      <h2 class="font-thin">Overview</h2>
      <p>
        AlgoDirectory is an on-chain directory of the Algorand ecosystem. It uses a decentralized,
        permissionless smart contract protocol to manage listings and create incentives for listing
        owners to maintain their own data rather than relying on the efforts of a central curator.
      </p>
      <h2 class="font-thin">How It Works</h2>
      <p>
        The Directory extends the functionality of segments of the Non-Fungible Domain
        directory.algo. Segment owners can "list" their segment in the Directory, where properties
        of the NFD segment become details in the listing.
      </p>
      <p>
        The AlgoDirectory smart contract uses a "Vouching Protocol" that allows listing owners to
        "vouch" for their listings by depositing collateral to "put their money where their mouth
        is" and signal that they stand behind the listing.
      </p>
      <p>
        The web app interface allows users to sort through all listings and see individual listing
        details. The Directory also allows users to see how much Algo has been deposited to vouch
        for each listing and how recently the listing was updated.
      </p>
      <p>
        All together, this system puts responsibility for data maintenance onto listing owners
        rather than centralized directory curators, who have historically been unpaid volunteers.
      </p>
      <p>
        Anything can be listed in AlgoDirectory: businesses, apps, NFT projects, websites,
        individuals, open source software, or anything that may be relevant to the Algorand
        ecosystem.
      </p>
      <p>
        To create a listing in AlgoDirectory, first{" "}
        <a
          href="https://app.nf.domains/name/directory.algo?view=segments"
          target="_blank"
          class="font-thin text-blue-500 hover:underline"
        >
          mint a segment
        </a>{" "}
        of directory.algo at NFDomains, then return to this site and click "Manage" to be guided
        through the listing process.
      </p>
      <h2 class="font-thin">Vouching Protocol</h2>
      <p>AlgoDirectory's Vouching Protocol provides the following methods to manage listings:</p>
      <p>
        <span class="uppercase">Create: </span>Select a segment of directory.algo that you own and
        deposit some collateral to vouch for your listing. The amount vouched will be displayed in
        the Directory and affect default listing order. You can list an NFD segment you own as long
        as it is not for sale or expired at NFD.
      </p>
      <p>
        <span class="uppercase">Refresh: </span>Listings in the Directory automatically age to show
        their freshness. To reset the age of your listing, refresh it. You can edit the listing's
        tags when refreshing it. You can refresh a listing for an NFD segment you own as long as it
        is not for sale or expired at NFD.
      </p>
      <p>
        <span class="uppercase">Abandon: </span>To recover the collateral for a listing, it can be
        abandoned, which delists that segment from the Directory. The collateral is returned to the
        original creator's address. If you have purchased an NFD segment, you can abandon the
        existing listing for it and then create your own.
      </p>
      <p>
        <span class="uppercase">Remove: </span>If the NFD segment underlying a listing has been sold
        and changed owners, it is considered to be stale and can be removed by any caller.
        Collateral is returned to the original listing creator, so there is no penalty when this
        occurs. This feature is not currently available through the web app.
      </p>
      <p>
        <span class="uppercase">Delete: </span>AlgoDirectory has administrators, a role that is
        granted by holding a special token, who can delete any listing at any time for any reason.
        If a listing is deleted by an admin, the collateral is yeeted to the fee sink as a penalty.
        Do not create a listing if you think it might be objectionable, lest it get deleted by an
        admin.
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
        history, most of which are now defunct. Others have included Algo Tables, AlgoAdoption, Algo
        Curator, Into The Algoverse, Awesome Algorand, and even a subsite created by the Algorand
        Foundation.
      </p>
      <p>
        Following the news that directorydotalgo.xyz was shutting down, we endeavored to pick up the
        torch, take a new approach, and submit an xGov proposal to build AlgoDirectory. We remain
        grateful to the community for approving that grant and hope the AlgoDirectory can continue
        to give back to the community for many moons.
      </p>
      <h2 class="font-thin">Guiding Principles</h2>
      <p>
        This directory aims to be best first stop new users in Algorand ecosystem, a valuable
        reference guide for existing Algorand enthusiasts, and the premier place for projects to be
        listed and discovered. To achieve that goal, AlgoDirectory improves upon previous Algorand
        directories in three key ways:
      </p>
      <ol>
        <li>
          <h3 class="font-thin">Decentralized, Permissionless, Permanent</h3>
          <p>
            AlgoDirectory leverages Algorand’s powerful on-chain capabilties to provide a directory
            that applies the values we love about Algorand to the Directory itself. It is
            decentralized across the node network, open to anyone through a permissionless smart
            contract, and permanent for the lifetime of the chain.
          </p>
        </li>
        <li>
          <h3 class="font-thin">Designed for Quality and Freshness</h3>
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
          <h3 class="font-thin">Sustainable for the Long Term</h3>
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
        data management occurs on-chain, the NFD smart contracts are permissionless and can be
        locked for immutability, and and the Directory UI could theoretically be enhanced in the
        future to read NFD metadata directly from the chain. We think this is a reasonable and
        practical approach to bootstrapping an on-chain directory.
      </p>
      <h2 class="font-thin">Business Model</h2>
      <p>
        This work has been performed with support from the Algorand Foundation xGov Grants Program.
        The creation of AlgoDirectory was funded by xGov-123, and we thank the Algorand xGovs for
        approving our proposal proactively. We hope that the Directory will be embraced by the
        community and become a valuable resource for it.
      </p>
      <p>
        The Directory is not intended to generate profit for the AlgoDirectory team, so there is no
        markup above NFD's minimum cost to mint segments. When minting a segment of directory.algo,
        100% of minting fees go to NFDomains.
      </p>
      <p>
        Creating listings requires collateral to be deposited, but AlgoDirectory does not take any
        fees for any interaction (Algorand transaction fees are required, of course).
      </p>
      <h2 class="font-thin">Disclaimer</h2>
      <p>
        Use at your own risk. Always verify in your wallet that each transaction is what you
        expected before signing. Once collateral is sent to the smart contract to create a listing,
        the collateral can only be returned to that account when the listing is abandoned. This
        software is provided under MIT license, and the source code is available through the GitHub
        link in the page footer.
      </p>
      <h2 class="font-thin">Terms of Use</h2>
      <p>
        All AlgoDirectory listings are subject to administrator review and may be deleted at the
        sole discretion of any administrator without notice. If a listing is deleted, the collateral
        deposited for that listing will be sent to the Algorand Mainnet fee sink address.
        AlgoDirectory, its creators, any appointed administrators, and Distributed Ledger
        Technologies, LLC, are not liable for any loss or damages whatsoever resulting from the use
        of this software or the deletion of any listing. Play nice, keep listings safe for work, and
        enjoy the Directory.
      </p>
      <h2 class="font-thin">App Info</h2>
      <p>
        Wallet interfaces provided by{" "}
        <a
          href="https://github.com/TxnLab/use-wallet"
          target="_blank"
          class="font-thin text-blue-500 hover:underline"
        >
          use-wallet
        </a>
        . Support Free Open Source Software (FOSS) with code contributions or sponsorship!
      </p>
      <p>Version 0.0.1</p>
    </main>
  )
}
