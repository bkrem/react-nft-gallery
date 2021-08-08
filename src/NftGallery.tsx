import React, { CSSProperties, useEffect, useState } from 'react';
import { GalleryItem } from './components/GalleryItem';

import { OpenseaAsset } from './types/OpenseaAsset';
import { joinClassNames } from './utils';

import './styles/tailwind.css';
import './styles/loader.css';

const OPENSEA_API_OFFSET = 50;

export interface NftGalleryProps {
  /**
   * Ethereum address (`0x...`) for which the gallery should contain associated NFTs. Required.
   */
  ownerAddress: string;

  /**
   * Display asset metadata underneath the NFT. Defaults to `true`.
   */
  metadataIsVisible?: boolean;

  /**
   * Display gallery in dark mode. Defaults to `false`.
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
    <div className={joinClassNames(darkMode ? 'dark' : '', 'h-full')}>
      <div
        style={galleryContainerStyle}
        className="h-full p-6 overflow-scroll bg-gray-50 dark:bg-gray-900"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full dark:text-gray-200">
            <div className="rnftg-loader text-gray-800 dark:text-gray-200"></div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-flow-col md:grid-flow-row md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {displayedAssets.map((asset) => (
                <GalleryItem
                  key={asset.id}
                  asset={asset}
                  metadataIsVisible={metadataIsVisible}
                  itemContainerStyle={itemContainerStyle}
                  imgContainerStyle={imgContainerStyle}
                />
              ))}
            </div>
            {canLoadMore && (
              <div className="flex justify-center">
                <button
                  className="p-4"
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
