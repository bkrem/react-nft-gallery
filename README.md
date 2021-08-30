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
> - The gallery may not always render/behave as expected across different browsers & browser versions.
>   Please [open an issue](https://github.com/bkrem/react-nft-gallery/issues) in this case.
> - The gallery may not render/behave as expected for your use case.
>   Please [open an issue](https://github.com/bkrem/react-nft-gallery/issues) in this case.

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [Roadmap](#roadmap)

## Installation

```bash
npm i --save react-nft-gallery
```

## Usage

`ownerAddress` is the only prop that is required out-of-the-box:

```tsx
import { NftGallery } from 'react-nft-gallery';

// ...

return <NftGallery ownerAddress="0x2e675eeae4747c248bfddbafaa3a8a2fdddaa44b" />;
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

- [x] feat: support ENS domain resolution in `ownerAddress` ✅
- [ ] feat: support keyboard navigation for lightbox (P1)
- [ ] bug: ensure `showcaseMode` can render all specified showcase items immediately without needing to hit "load more" (P2)
- [ ] docs: document component props and common patterns/configurations better (P2)
- [ ] feat: support swiping in lightbox for touch devices (P2)
- [ ] feat: remove "load more" button and auto-resolve all assets via recursive pagination on OpenSea API (P2)
