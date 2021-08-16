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

> ⚠️ This library is currently still in beta and should not be considered stable until `v1.0.0` is released.
>
> This means:
>
> - Things may not always render as expected across different browsers and browser versions.
> - The top-level API (i.e. `NftGalleryProps`) may see breaking changes between releases until standard
>   semantic versioning is adopted from `v1.0.0` onwards.

## API

````ts
interface NftGalleryProps {
  /**
   * Ethereum address (`0x...`) for which the gallery should contain associated NFTs.
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
