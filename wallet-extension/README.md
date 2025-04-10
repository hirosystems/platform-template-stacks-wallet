# Stacks wallet extension template

This wallet template is scaffold using Vue 3 in Vite.

This wallet template is compatible with Chrome [extensions](https://developer.chrome.com/docs/extensions) via the `manifest.json` file located in the `/public` folder, which also houses important context scripts:

- `content.js` - Acts as the communication layer between the document page and the `background.js` script
- `background.js` - Acts as the communication layer between the `content.js` script and the popup script

The `/src` folders houses all the scripts used in the extension popup.

> IMPORTANT: This browser wallet extension will store the generated mneomic seed phrase in the browser's local storage without any standard encryption best practices. If you plan to use this in a production environment, implement secure best practices for the safe storage of users' mnemonic seed phrases.

## Bundle and Enable Wallet Extension in Browser

- Run `npm run build` in the `wallet-extension` directory or `npm run build --workspace=wallet-extension` in the root directory.
- The generated build file will live in a new `dist/` folder which will be added as a Chrome extension in your browser:
  1. Enable Developer Mode:
  - Open Chrome and go to [chrome://extensions](chrome://extensions/).
  - Toggle on the "Developer mode" switch in the top right corner.
  2. Load the Unpacked Extension:
  - Click the "Load unpacked" button.
  - Navigate to the folder containing your extension's files and click "Select Folder".
  - Chrome will then load and install the extension.
  - Enable and pin the extension to your browser.
  - Click the reload button in the extension card if you make changes to the `dist/` folder.

## Basic default functions/features of this Stacks wallet

- Generates random mnemonic seed phrase
- Importing of mnemonic seed phrase
- Creates Stacks and Bitcoin addresses
- Supports @stacks/connect methods

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
