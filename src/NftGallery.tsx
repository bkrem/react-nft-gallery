import React, { useEffect, useState } from 'react';
// import styled from '@emotion/styled';

import './tailwind.css';

// const DescriptionOverlay = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   border-radius: 1rem;
//   color: white;
//   text-align: center;
//   background-color: transparent;
//   opacity: 0;

//   &:hover {
//     cursor: pointer;
//     background-color: rgba(0, 0, 0, 0.8);
//     opacity: 1;
//   }
// `;

// const Description = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// `;

const OPENSEA_API_OFFSET = 50;

// const ImageWithOverlay: React.FC<{ asset: any }> = ({ asset }) => {
//   return (
//     <article className="relative rounded-2xl">
//       <Img src={asset.image_preview_url} alt={asset.name} loading="lazy" />
//       <DescriptionOverlay>
//         <Description>
//           <h1>{asset.name}</h1>
//           <h2>Collection: {asset.collection.name}</h2>
//         </Description>
//       </DescriptionOverlay>
//     </article>
//   );
// };

const ImageWithAttributes: React.FC<{
  asset: any;
  metadataIsVisible: NftGalleryProps['metadataIsVisible'];
}> = ({ asset, metadataIsVisible }) => {
  return (
    <article className="rounded-2xl bg-white dark:bg-gray-800">
      <div style={{ height: '20rem' }}>
        {asset.image_preview_url ? (
          <img
            className={`w-full h-full object-cover ${
              metadataIsVisible ? 'rounded-t-2xl' : 'rounded-2xl'
            }`}
            src={asset.image_preview_url}
            alt={asset.name}
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col justify-center items-center w-full h-full break-words cursor-pointer truncate text-lg font-semibold dark:text-gray-200">
            {asset.name || asset.token_id}
          </div>
        )}
      </div>
      {metadataIsVisible && (
        <div data-test-id="metadata-section" className="p-4">
          <div className="break-words cursor-pointer truncate text-lg font-semibold dark:text-gray-200">
            {asset.name}
          </div>
          <hr className="mx-4 border-gray-100 dark:border-gray-800" />
          <div className="flex items-center">
            {asset.collection.image_url && (
              <img
                src={asset.collection.image_url}
                alt={asset.collection.name}
                className="w-8 h-8 mr-2 rounded-full"
              />
            )}
            <div className="text-sm font-semibold truncate dark:text-gray-200">
              {asset.collection.name}
            </div>
          </div>
        </div>
      )}
    </article>
  );
};

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
    console.log('Got %s assets', rawAssets.length, rawAssets);
    setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
    setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
  };

  useEffect(() => {
    loadAssets(ownerAddress, currentOffset);
  }, [ownerAddress, currentOffset]);

  // TODO: Handle rendering of .mp4 previews
  // TODO: handle rendering of non-image assets (e.g. ENS,...)
  // TODO: handle no asset.name case
  // TODO: remove debug bg color
  return (
    <section className={darkMode ? 'dark' : ''}>
      <div className="bg-yellow-100 dark:bg-gray-900">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((asset: any) => (
            <ImageWithAttributes
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
