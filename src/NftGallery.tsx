import React, { CSSProperties, useEffect, useState } from 'react';
import { GalleryItem } from './components/GalleryItem/GalleryItem';

import { OpenseaAsset } from './types/OpenseaAsset';
import { joinClassNames } from './utils';

import './styles/tailwind.css';
import './styles/loader.css';

const OPENSEA_API_OFFSET = 50;

export interface NftGalleryProps {
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

export const NftGallery: React.FC<NftGalleryProps> = ({
  ownerAddress = '',
  darkMode = false,
  metadataIsVisible = true,
  showcaseMode = false,
  showcaseItemIds,
  hasLightbox = true,
  isInline = false,
  galleryContainerStyle,
  itemContainerStyle,
  imgContainerStyle,
}) => {
  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [showcaseAssets, setShowcaseAssets] = useState([] as OpenseaAsset[]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const displayedAssets = showcaseMode ? showcaseAssets : assets;

  const fetchAssets = async (
    owner: NftGalleryProps['ownerAddress'],
    offset = 0
  ): Promise<OpenseaAsset[]> => {
    try {
      const result = await fetch(
        `https://api.opensea.io/api/v1/assets?exclude_currencies=true&owner=${owner}&limit=50&offset=${offset}`
      );
      if (result.status !== 200) {
        const error = await result.text();
        throw new Error(error);
      }
      const { assets } = await result.json();
      return assets;
    } catch (error) {
      console.error('fetchAssets failed:', error);
      return [];
    }
  };

  const loadAssets = async (
    owner: NftGalleryProps['ownerAddress'],
    offset: number
  ) => {
    if (assets.length === 0) setIsLoading(true);
    const rawAssets = await fetchAssets(owner, offset);
    setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
    setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
    if (assets.length === 0) setIsLoading(false);
  };

  const updateShowcaseAssets = (
    allAssets: OpenseaAsset[],
    itemIds: string[]
  ) => {
    const nextShowcaseAssets = allAssets.filter((asset) =>
      itemIds.includes(`${asset.asset_contract.address}/${asset.token_id}`)
    );
    setShowcaseAssets(nextShowcaseAssets);
  };

  useEffect(() => {
    loadAssets(ownerAddress, currentOffset);
  }, [ownerAddress, currentOffset]);

  useEffect(() => {
    if (assets.length !== 0 && showcaseMode && Array.isArray(showcaseItemIds)) {
      updateShowcaseAssets(assets, showcaseItemIds);
    }
  }, [assets, showcaseMode, showcaseItemIds]);

  return (
    <div
      className={joinClassNames(darkMode ? 'rnftg-dark' : '', 'rnftg-h-full')}
    >
      <div
        style={galleryContainerStyle}
        className={joinClassNames(
          'rnftg-h-full rnftg-p-6 rnftg-overflow-auto rnftg-bg-gray-50 dark:rnftg-bg-gray-900',
          isInline ? 'rnftg--inline' : ''
        )}
      >
        {isLoading ? (
          <div className="rnftg-flex rnftg-justify-center rnftg-items-center rnftg-h-full dark:rnftg-text-gray-200">
            <div className="rnftg-loader rnftg-text-gray-800 dark:rnftg-text-gray-200"></div>
          </div>
        ) : (
          <>
            <div
              className={joinClassNames(
                'rnftg-grid rnftg-gap-6',
                isInline
                  ? 'rnftg-grid-flow-col'
                  : 'rnftg-grid-flow-row rnftg-grid-cols-1 md:rnftg-grid-cols-2 lg:rnftg-grid-cols-3 xl:rnftg-grid-cols-4'
              )}
            >
              {displayedAssets.map((asset, index) => (
                <GalleryItem
                  key={asset.id}
                  index={index}
                  asset={asset}
                  metadataIsVisible={metadataIsVisible}
                  hasLightbox={hasLightbox}
                  itemContainerStyle={itemContainerStyle}
                  imgContainerStyle={imgContainerStyle}
                />
              ))}
            </div>
            {canLoadMore && (
              <div className="rnftg-flex rnftg-justify-center">
                <button
                  className="rnftg-p-4"
                  onClick={() => {
                    setCurrentOffset(
                      (prevOffset) => prevOffset + OPENSEA_API_OFFSET
                    );
                  }}
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
