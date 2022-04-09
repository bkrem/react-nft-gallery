<h1 align="center">React NFT Gallery</h1>

<p align="center">
  <a href="#">
    <img alt="build status" src="https://github.com/bkrem/react-nft-gallery/workflows/CI/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/react-nft-gallery">
    <img alt="npm package" src="https://img.shields.io/npm/v/react-nft-gallery?style=flat">
  </a>
  <!-- <a href="https://www.npmjs.com/package/react-nft-gallery">
    <img alt="npm package: downloads monthly" src="https://img.shields.io/npm/dm/react-nft-gallery.svg">
  </a> -->
  <a href="https://bundlephobia.com/result?p=react-nft-gallery">
    <img alt="npm package: minzipped size" src="https://img.shields.io/bundlephobia/minzip/react-nft-gallery">
  </a>
  <a href="https://www.npmjs.com/package/react-nft-gallery">
    <img alt="npm package: types" src="https://img.shields.io/npm/types/react-nft-gallery">
  </a>
  <a href="https://github.com/prettier/prettier">
    <img alt="code style: prettier" src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg">
  </a>
  <a href="#">
    <img alt="module formats: cjs, esm" src="https://img.shields.io/badge/module%20formats-cjs%2C%20esm-green.svg">
  </a>
</p>

<p align="center">
  <h3 align="center"><span>👾 </span><a href="https://bkrem.github.io/react-nft-gallery">Playground (Storybook)</a></h3>
</p>

React NFT Gallery is a React component to render any Ethereum address's NFTs as a gallery.
The NFT assets for an address are resolved via the [OpenSea API](https://docs.opensea.io/reference/api-overview).

> ⚠️ **Please note**: This library is currently in beta and should not be considered stable until `v1.0.0` is released.
>
> This means:
>
> - The gallery may see breaking changes between minor versions until `v1.0.0` is released.
> - The gallery may not always render/behave as expected across different browsers & browser versions.
>   Please [open an issue](https://github.com/bkrem/react-nft-gallery/issues) in this case.
> - The gallery may not render/behave as expected for your use case.
>   Please [open an issue](https://github.com/bkrem/react-nft-gallery/issues) in this case.

- [OpenSea API Key](#opensea-api-key)
- [Installation](#installation)
- [Usage](#usage)
  - [Using a custom API endpoint](#using-a-custom-api-endpoint)
- [API](#api)
- [Roadmap](#roadmap)

## OpenSea API Key

OpenSea has recently added the requirement for an `X-API-KEY` header to be passed for any non-trivial
requests to their [`/assets` endpoint](https://docs.opensea.io/reference/getting-assets).
By default, `react-nft-gallery` can now only fetch the first 20 assets for any provided `ownerAddress`.

The gallery's full capabilities are available by passing an OpenSea API key as the `openseaApiKey` prop, or by [using a custom API endpoint](#using-a-custom-api-endpoint).

To request an API key, please consult the [API key form on the OpenSea docs](https://docs.opensea.io/reference/request-an-api-key).

## Installation

```bash
npm i --save react-nft-gallery
```

## Usage

`ownerAddress` is the only prop that is required out-of-the-box:

```tsx
import { NftGallery } from 'react-nft-gallery';

// ...

return <NftGallery ownerAddress="vitalik.eth" />;
```

### Using a custom API endpoint

To use a custom API endpoint, pass it via the `apiUrl` prop.

If the endpoint injects an OpenSea API key, set the `isProxyApi` prop to `true`.
This allows for paginated requests without exposing the OpenSea API key in the client via `openseaApiKey`:

```tsx
import { NftGallery } from 'react-nft-gallery';

// ...

return (
  <NftGallery
    ownerAddress="vitalik.eth"
    apiUrl="https://your-opensea-api-proxy.vercel.app"
    isProxyApi={true}
  />
);
```

## API

````ts
interface NftGalleryProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;

  /**
   * OpenSea API key, which is required for non-trivial use cases of the OpenSea API's `/assets` endpoint.
   * See the endpoint's documentation for more information: https://docs.opensea.io/reference/getting-assets
   */
  openseaApiKey?: string;

  /**
   * Set to `true` when using a proxy API to hide the OpenSea API key.
   * Otherwise the gallery disables pagination if `openseaApiKey` is also not provided.
   */
  isProxyApi?: boolean;

  /**
   * Set a custom API URL.
   */
  apiUrl?: string;

  /**
   * Auto retry (max. 10 times) after an API request failed.
   */
  autoRetry?: boolean;

  /**
   * Display asset metadata underneath the NFT.
   * Defaults to `true`.
   */
  metadataIsVisible?: boolean;

  /**
   * Display gallery in dark mode.
   * Defaults to `false`.
   */
  darkMode?: boolean;

  /**
   * Display gallery in showcase mode. Only NFTs specified in `showcaseItemIds` will be rendered.
   * Defaults to `false`.
   */
  showcaseMode?: boolean;

  /**
   * An array of IDs for assets that should be displayed when `showcaseMode` is active.
   * Each ID is formed by combining the asset's contract address and the asset's own tokenId: `{:assetContractAddress}/{:tokenId}`
   *
   * For example:
   *
   * ```jsx
   * showcaseItemIds={["0xabcdef.../123", "0xa1b2c3.../789"]}
   * ```
   */
  showcaseItemIds?: string[];

  /**
   * Enables/disables the lightbox being shown when a gallery item is clicked/tapped.
   * Defaults to `true`.
   */
  hasLightbox?: boolean;

  /**
   * Enables/disables a gallery item's title and collection name linking to the asset and collection on OpenSea, respectively.
   * Defaults to `true`.
   */
  hasExternalLinks?: boolean;

  /**
   * Renders the gallery as a single row with horizontal scrolling. Useful when rendering the gallery between other content.
   * Defaults to `false`.
   */
  isInline?: boolean;

  /**
   * Disables lazy loading and shows a "Load more" button to fetch the next set of gallery items.
   * Defaults to `false`.
   */
  hasLoadMoreButton?: boolean;

  /**
   * Overrides the default styling of the gallery's container.
   */
  galleryContainerStyle?: CSSProperties;

  /**
   * Overrides the default styling of all gallery item containers.
   */
  itemContainerStyle?: CSSProperties;

  /**
   * Overrides the default styling of all gallery item image containers.
   */
  imgContainerStyle?: CSSProperties;
}
````

## Roadmap

- [x] feat: support ENS domain resolution in `ownerAddress`
- [x] feat: support keyboard navigation for lightbox
- [x] feat: remove "load more" button and auto-resolve all assets via recursive pagination on OpenSea API (P1)
- [x] feat: use card placeholders instead of spinner for loading phase (P1)
- [ ] docs: document component props and common patterns/configurations better (P1)
- [ ] feat: add transitions on thumbnail load, enter/exit lightbox, forward/back lightbox item (P2)
- [ ] feat: support swiping in lightbox for touch devices (P2)
