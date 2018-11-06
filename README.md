# ClearCoin Browser Extension

Earn ClearCoin (XCLR) while you browse the web.

[Click here to view/install the ClearCoin extension on the Chrome Web Store](https://chrome.google.com/webstore/detail/clearcoin-the-ad-blocker/benncgglohdbeapbakcebdobkdbkdcba).

## ClearCoin Support

If you're a user seeking support, email us at [help@clearcoin.co](mailto:help@clearcoin.co).

## Building locally

 - Install [Node.js](https://nodejs.org/en/) version 8.11.3 and npm version 6.1.0
   - If you are using [nvm](https://github.com/creationix/nvm#installation) (recommended) running `nvm use` will automatically choose the right node version for you.
   - Select npm 6.1.0: ```npm install -g npm@6.1.0```
 - Install dependencies: ```npm install```
 - Install gulp globally with `npm install -g gulp-cli`.
 - Build the project to the `./dist/` folder with `gulp build`.
 - To package .zip files for distribution, run `gulp zip`, or run the full build & zip with `gulp dist`.

 Uncompressed builds can be found in `/dist`, compressed builds can be found in `/builds` once they're built.

## Development

```bash
npm install
npm start
```

## Other Docs

- [How to add custom build to Chrome](./docs/add-to-chrome.md)
- [How to add a new translation to ClearCoin](./docs/translating-guide.md)
- [How to live reload on local dependency changes](./docs/developing-on-deps.md)
- [How to manage notices that appear when the app starts up](./docs/notices.md)

## Attribution

ClearCoin Browser Extension is built upon the proven security of [MetaMask](https://metamask.io/), and also borrows heavily from [uBlock Origin](https://github.com/gorhill/uBlock).
