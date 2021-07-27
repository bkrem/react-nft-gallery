import React, { useEffect, useState } from 'react';

export interface NftGalleryProps {
  /** Ethereum address for which the gallery should contain associated NFTs. */
  ownerAddress: string;
}

const OPENSEA_API_OFFSET = 50;

export const NftGallery: React.FC<NftGalleryProps> = ({ ownerAddress }) => {
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
    const assets = await fetchAssets(owner, offset);
    console.log('Got %s assets', assets.length);
    setAssets((prevAssets) => [...prevAssets, ...assets]);
    setCanLoadMore(assets.length === OPENSEA_API_OFFSET);
  };

  useEffect(() => {
    loadAssets(ownerAddress, currentOffset);
  }, [ownerAddress, currentOffset]);

  return (
    <div style={styles.grid as any}>
      {assets.map((asset: any, i) => (
        <a key={asset.name + i} href="#" style={styles.card as any}>
          <h2>{asset.name}</h2>
          {/* <p>{asset.description}</p> */}
          <img src={asset.image_preview_url} alt="" />
        </a>
      ))}
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

const styles = {
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    maxWidth: '800px',
    marginTop: '3rem',
  },

  card: {
    margin: '1rem',
    padding: '1.5rem',
    textAlign: 'left',
    color: 'inherit',
    textDecoration: 'none',
    border: '1px solid #eaeaea',
    borderRadius: '10px',
    transition: 'color 0.15s ease, border-color 0.15s ease',
    width: '45%',
  },
};
