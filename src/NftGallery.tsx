import React, { useEffect, useState } from 'react';
import { GalleryItem } from './components/GalleryItem';

import './tailwind.css';
import { OpenseaAsset } from './types/OpenseaAsset';

const OPENSEA_API_OFFSET = 50;

export interface NftGalleryProps {
  /**
   * Ethereum address for which the gallery should contain associated NFTs.
   */
  ownerAddress: string;
  /**
   * Display gallery in dark mode.
   */
  darkMode?: boolean;
  /**
   * Display asset metadata.
   */
  metadataIsVisible?: boolean;
}

export const NftGallery: React.FC<NftGalleryProps> = ({
  ownerAddress = '',
  darkMode = true,
  metadataIsVisible = true,
}) => {
  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const fetchAssets = async (
    owner: NftGalleryProps['ownerAddress'],
    offset = 0
  ) => {
    try {
      const res = await fetch(
        `https://api.opensea.io/api/v1/assets?exclude_currencies=true&owner=${owner}&limit=50&offset=${offset}`
      );
      const { assets } = await res.json();
      return assets;
    } catch (error) {
      console.error('fetchAssets failed:', error);
    }
  };

  const loadAssets = async (
    owner: NftGalleryProps['ownerAddress'],
    offset: number
  ) => {
    const rawAssets = await fetchAssets(owner, offset);
    setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
    setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
  };

  useEffect(() => {
    loadAssets(ownerAddress, currentOffset);
  }, [ownerAddress, currentOffset]);

  return (
    <section className={darkMode ? 'dark' : ''}>
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset) => (
            <GalleryItem
              key={asset.id}
              asset={asset}
              metadataIsVisible={metadataIsVisible}
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
      </div>
    </section>
  );
};
