import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Gallery, { RenderImageProps } from 'react-photo-gallery';

const GalleryItemWrapper = styled.article`
  position: relative;
  margin: 1rem;
  border-radius: 1rem;

  background-color: green;
`;

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

const ImageComponent: React.FC<
  RenderImageProps & { photo: { asset: any } }
> = ({ photo }) => {
  const { src, asset } = photo;
  return (
    <GalleryItemWrapper
      key={asset.id}
      style={{ height: photo.height, width: photo.width }}
    >
      <Img src={src} alt={asset.name} loading="lazy" />
      <DescriptionOverlay>
        <Description>
          <h1>{asset.name}</h1>
          <h2>Collection: {asset.collection.name}</h2>
        </Description>
      </DescriptionOverlay>
    </GalleryItemWrapper>
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
    <div style={{ backgroundColor: 'papayawhip' }}>
      <Gallery
        photos={assets.map((asset: any) => ({
          asset,
          src: asset.image_preview_url,
          width: 1,
          height: 1,
        }))}
        // @ts-ignore
        renderImage={ImageComponent}
      />
      {canLoadMore && (
        <button
          onClick={() => {
            setCurrentOffset((prevOffset) => prevOffset + OPENSEA_API_OFFSET);
          }}
        >
          Load more
        </button>
      )}
    </div>
  );
};
