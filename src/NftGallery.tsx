import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  margin-top: 3rem;
`;

const AssetWrapper = styled.article`
  @media (max-width: 1500px) {
    /* height: calc(((100vw - 403px) - 90px) / 4); */
    width: calc(((100vw - 403px) - 90px) / 4);
  }
  @media (max-width: 1300px) {
    /* height: calc(((100vw - 403px) - 60px) / 3); */
    width: calc(((100vw - 403px) - 60px) / 3);
  }
  @media (max-width: 1000px) {
    /* height: calc(((100vw - 403px) - 30px) / 2); */
    width: calc(((100vw - 403px) - 30px) / 2);
  }
  @media (max-width: 850px) {
    margin: 9.5px;
    /* height: calc((100vw - 86px) / 3); */
    width: calc((100vw - 86px) / 3);
  }
  @media (max-width: 650px) {
    /* height: calc(50vw - 33.5px); */
    width: calc(50vw - 33.5px);
  }
  @media (max-width: 480px) {
    /* height: calc(50vw - 26.5px); */
    margin: 7.5px;
    width: calc(50vw - 26.5px);
  }
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export interface NftGalleryProps {
  /** Ethereum address for which the gallery should contain associated NFTs. */
  ownerAddress: string;
}

const OPENSEA_API_OFFSET = 50;

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

  return (
    <>
      <Grid>
        {/* TODO: Handle rendering of .mp4 previews */}
        {assets.map((asset: any) => (
          <AssetWrapper
            style={{ backgroundColor: 'papayawhip' }}
            key={asset.id}
          >
            <div>
              <Img
                src={asset.image_preview_url}
                alt={asset.name}
                loading="lazy"
              />
              <div>
                <p>Name: {asset.name}</p>
                <p>Collection: {asset.collection.name}</p>
              </div>
            </div>
          </AssetWrapper>
        ))}
      </Grid>
      {canLoadMore && (
        <button
          onClick={() => {
            setCurrentOffset((prevOffset) => prevOffset + OPENSEA_API_OFFSET);
          }}
        >
          Load more
        </button>
      )}
    </>
  );
};
