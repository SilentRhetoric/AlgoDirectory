# AlgoDirectory

AlgoDirectory is an on-chain directory of Algorand. The live web app can be found at [https://algodirectory.app](https://algodirectory.app).

The app utilizes [SolidJS](https://www.solidjs.com) for reactivity and [SolidStart](https://docs.solidjs.com/solid-start) as a meta-framework, [Vinxi](https://vinxi.vercel.app/) dev tooling, [Tailwind CSS](https://tailwindcss.com) styles, and [solid-ui](https://www.solid-ui.com/) components.

This work has been performed with support from the Algorand Foundation xGov Grants Program.

[![Netlify Status](https://api.netlify.com/api/v1/badges/e88b5e95-9cf0-4adc-9422-df467d3075be/deploy-status)](https://app.netlify.com/sites/algodirectory/deploys)

## Developing on this SolidStart Project

Once you've installed dependencies with `pnpm install`, start a development server:

```bash
pnpm run dev
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `pnpm run build` will generate a Node app that you can run with `pnpm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

This project was created with the [Solid CLI](https://solid-cli.netlify.app).
