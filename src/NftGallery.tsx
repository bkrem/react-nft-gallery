import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import './index.css';

const DescriptionOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  color: white;
  text-align: center;
  background-color: transparent;
  opacity: 0;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.8);
    opacity: 1;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem;
`;

export interface NftGalleryProps {
  /** Ethereum address for which the gallery should contain associated NFTs. */
  ownerAddress: string;
}

const OPENSEA_API_OFFSET = 50;

const ImageComponent: React.FC<{ photo: { asset: any; src: any } }> = ({
  photo,
}) => {
  const { src, asset } = photo;
  return (
    <article className="relative rounded-2xl" key={asset.id}>
      <Img src={src} alt={asset.name} loading="lazy" />
      <DescriptionOverlay>
        <Description>
          <h1>{asset.name}</h1>
          <h2>Collection: {asset.collection.name}</h2>
        </Description>
      </DescriptionOverlay>
    </article>
  );
};

export const NftGallery: React.FC<NftGalleryProps> = ({
  ownerAddress = '',
}) => {
  const [assets, setAssets] = useState([] as any[]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [canLoadMore, setCanLoadMore] = useState(false);

  const fetchAssets = async (owner: string, offset = 0) => {
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

  const loadAssets = async (owner: string, offset: number) => {
    const rawAssets = await fetchAssets(owner, offset);
    const displayableAssets = rawAssets.filter((asset: any) =>
      Boolean(asset.image_preview_url)
    );
    console.log('Got %s assets', rawAssets.length, rawAssets);
    console.log('%s displayable assets', displayableAssets.length);

    setAssets((prevAssets) => [...prevAssets, ...displayableAssets]);
    setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
  };

  useEffect(() => {
    loadAssets(ownerAddress, currentOffset);
  }, [ownerAddress, currentOffset]);

  /* TODO: Handle rendering of .mp4 previews */
  return (
    // TODO: remove debug bg
    <div className="bg-yellow-100">
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((asset: any) => (
          <ImageComponent
            photo={{
              asset,
              src: asset.image_preview_url,
            }}
          />
        ))}
      </div>
      {canLoadMore && (
        <div className="flex justify-center">
          <button
            className="p-4"
            onClick={() => {
              setCurrentOffset((prevOffset) => prevOffset + OPENSEA_API_OFFSET);
            }}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
};
