# AlgoDirectory

[![Netlify Status](https://api.netlify.com/api/v1/badges/e88b5e95-9cf0-4adc-9422-df467d3075be/deploy-status)](https://app.netlify.com/sites/algodirectory/deploys)

AlgoDirectory is an on-chain directory of the Algorand ecosystem. It uses a decentralized,
permissionless smart contract protocol to manage listings and create incentives for listing
owners to maintain their own data rather than relying on the efforts of a central curator.

To learn more about AlgoDirectory, how it works, and its history, visit <https://algodirectory.app/about>.

This work has been performed with support from the Algorand Foundation xGov Grants Program.

## Contributing

The AlgoDirectory project consists of three repositories:

1. [AlgoDirectory](https://github.com/SilentRhetoric/AlgoDirectory): This web interface for interacting with the Directory
2. [AlgoDirectory-Contract](https://github.com/SilentRhetoric/AlgoDirectory-Contract): The smart contract and associated deployment and testing scripts
3. [AlgoDirectory-Subscriber](https://github.com/SilentRhetoric/AlgoDirectory-Subscriber): A subsriber process that watches the chain for transactions to post on Twitter

We welcome pull requests from community contributors, although we recommend reaching out to us first given the complexity of the project.

### Trunk-Based Development

The site is configured via `netlify.toml` such a way that the `main` branch points to Mainnet and the `testnet` branch points to Testnet. For feature development, consider `testnet` to be the trunk, create feature branches from there, and PR into `testnet`. The `main` branch will be updated from `testnet` periodically as "releases."

### Developing on this SolidStart Project

The app utilizes [SolidJS](https://www.solidjs.com) for reactivity and [SolidStart](https://docs.solidjs.com/solid-start) as a meta-framework, [Vinxi](https://vinxi.vercel.app/) dev tooling, [Tailwind CSS](https://tailwindcss.com) styles, and [solid-ui](https://www.solid-ui.com/) components.

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

### Building this SolidStart Project

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `pnpm run build` will generate a Node app that you can run with `pnpm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

This project was created with the [Solid CLI](https://solid-cli.netlify.app).
