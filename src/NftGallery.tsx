import React, { useEffect, useState } from 'react';

export interface NftGalleryProps {
  /** Ethereum address for which the gallery should contain associated NFTs. */
  ownerAddress: string;
}

export const NftGallery: React.FC<{ ownerAddress: string }> = ({
  ownerAddress,
}) => {
  const [assets, setAssets] = useState([]);

  const fetchNftProfile = async () => {
    try {
      const res = await fetch(
        `https://api.opensea.io/api/v1/assets?exclude_currencies=true&owner=${ownerAddress}&limit=50&offset=0`
      );
      const { assets } = await res.json();
      setAssets(assets);
    } catch (error) {
      console.error('fetchNftProfile failed:', error);
    }
  };

  // TODO: iterate with +50 offset until we no longer receive full response (i.e. last items sent).
  useEffect(() => {
    fetchNftProfile();
  }, [ownerAddress]);

  return (
    <div style={styles.grid as any}>
      {assets.map((asset: any) => (
        <a key={asset.name} href="#" style={styles.card as any}>
          <h2>{asset.name}</h2>
          {/* <p>{asset.description}</p> */}
          <img src={asset.image_preview_url} alt="" />
        </a>
      ))}
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
