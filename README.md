# AlgoDirectory

Bonfire is a tool for burning Algorand Standard Assets (ASA). The live web app can be found at [https://thebonfire.app](https://thebonfire.app).

The app utilizes [SolidJS](https://www.solidjs.com) for reactivity and [SolidStart](https://docs.solidjs.com/solid-start) as a meta-framework, [Vinxi](https://vinxi.vercel.app/) dev tooling, [Tailwind CSS](https://tailwindcss.com) styles, and [solid-ui](https://www.solid-ui.com/) components.

This work has been performed with support from the Algorand Foundation xGov Grants Program.

[![Netlify Status](https://api.netlify.com/api/v1/badges/e88b5e95-9cf0-4adc-9422-df467d3075be/deploy-status)](https://app.netlify.com/sites/algodirectory/deploys)

## What is AlgoDirectory?

AlgoDirectory was created to be the best first stop for new users upon joining the Algorand ecosystem, a valuable reference guide for existing Algorand enthusiasts, and the premier place for projects to be listed and discovered.

AlgoDirectory improves upon previous Algorand directories in three key ways:

### Decentralized, Permissionless, Permanent

AlgoDirectory leverages Algorand’s powerful on-chain capabilties to provide a directory that applies the values we love about Algorand to the Directory itself. It will be decentralized across the network, open to anyone through a permissionless smart contract, and permanent for the lifetime of the chain.

### Designed for Quality and Freshness

A central challenge of directories is keeping their information up to date so it is useful to people. AlgoDirectory uses a novel Vouching Protocol to automate the process of determining if listings are still valid and active. Listing owners effectively vouch for their listings by providing a guarantee and interacting with them regularly. This system provides on-chain data about whether someone stands behind a listing and how long it has been since the owner refreshed a listing. This way, listings can be automatically sorted and filtered so that active with people vouching for them get the visibility they deserve while stale ones or ones that have been abandoned are still discoverable but de-emphasized.

### Sustainable for the Long Term

Another key objective of AlgoDirectory is to be sustainable so that it outlasts the efforts of its creators and any centralized website hosting. Algorand has had several directories over the years, some of which are now gone because their creators are no longer curating them and paying for their Web2 sites. By putting the Directory on chain and providing open source code to interact with it, listings on AlgoDirectory will always be accessible.

## Developing on this SolidStart Project

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `pnpm run build` will generate a Node app that you can run with `pnpm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

This project was created with the [Solid CLI](https://solid-cli.netlify.app).
