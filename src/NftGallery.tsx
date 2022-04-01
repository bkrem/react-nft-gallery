import React, { CSSProperties, useEffect, useState } from 'react';
import InView from 'react-intersection-observer';

import { GalleryItem } from './components/GalleryItem/GalleryItem';
import { LoadMoreButton } from './components/LoadMoreButton';
import { RetryButton } from './components/RetryButton';
import { OpenseaAsset } from './types/OpenseaAsset';
import { isEnsDomain, joinClassNames } from './utils';
import {
  fetchOpenseaAssets,
  OPENSEA_API_OFFSET,
  resolveEnsDomain,
} from './api';

import './styles/tailwind.css';
import { SkeletonCard } from './components/SkeletonCard';
import { useLightboxNavigation } from './hooks/useLightboxNavigation';

export interface ErrorPopupProps {
  onClick: () => void;
}
export interface NftGalleryProps {
  /**
   * Ethereum address (`0x...`) or ENS domain (`vitalik.eth`) for which the gallery should contain associated NFTs.
   * Required.
   */
  ownerAddress: string;

  /**
   * OpenSea API key, which is required for non-trivial use cases of the OpenSea API's `/assets` endpoint.
   * See the endpoint's documentation for more information: https://docs.opensea.io/reference/getting-assets
   */
  openseaApiKey?: string;

  /**
   * Set true when using an proxy API which is used to hide API key. Otherwise component disables pagination when no API key provided.
   */
  isProxyApi?: boolean;

  /**
   * Set custom API URL.
   */
  apiUrl?: string;

  /**
   * Auto retry (10 times by default) after a request failed.
   */
  autoRetry?: boolean;

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
   * Enables/disables a gallery item's title and collection name linking to the asset and collection on OpenSea, respectively.
   * Defaults to `true`.
   */
  hasExternalLinks?: boolean;

  /**
   * Renders the gallery as a single row with horizontal scrolling. Useful when rendering the gallery between other content.
   * Defaults to `false`.
   */
  isInline?: boolean;

  /**
   * Disables lazy loading and shows a "Load more" button to fetch the next set of gallery items.
   * Defaults to `false`.
   */
  hasLoadMoreButton?: boolean;

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
  openseaApiKey = '',
  isProxyApi = false,
  apiUrl = '',
  autoRetry = false,
  darkMode = false,
  metadataIsVisible = true,
  showcaseMode = false,
  showcaseItemIds,
  hasLightbox = true,
  hasExternalLinks = true,
  isInline = false,
  hasLoadMoreButton = false,
  galleryContainerStyle,
  itemContainerStyle,
  imgContainerStyle,
}) => {
  const [assets, setAssets] = useState([] as OpenseaAsset[]);
  const [showcaseAssets, setShowcaseAssets] = useState([] as OpenseaAsset[]);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [currentCursor, setCurrentCursor] = useState('');
  const [nextCursor, setNextCursor] = useState('');
  const [hasError, setHasError] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    lightboxIndex,
    setLightboxIndex,
    decreaseLightboxIndex,
    increaseLightboxIndex,
  } = useLightboxNavigation(assets.length - 1);

  const displayedAssets = showcaseMode ? showcaseAssets : assets;

  const loadAssets = async (
    ownerAddress: NftGalleryProps['ownerAddress'],
    apiKey: NftGalleryProps['openseaApiKey'],
    isProxyApi: NftGalleryProps['isProxyApi'],
    apiUrl: NftGalleryProps['apiUrl'],
    autoRetry: NftGalleryProps['autoRetry'],
    cursor?: string
  ) => {
    setIsLoading(true);
    const owner = isEnsDomain(ownerAddress)
      ? await resolveEnsDomain(ownerAddress)
      : ownerAddress;
    const {
      assets: rawAssets,
      hasError,
      nextCursor,
    } = await fetchOpenseaAssets({
      owner,
      apiKey,
      isProxyApi,
      apiUrl,
      autoRetry,
      cursor,
    });
    if (hasError) {
      setHasError(true);
    } else {
      setHasError(false);
      setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
      setCurrentOffset((prevOffset) => prevOffset++);
      setCanLoadMore(rawAssets.length === OPENSEA_API_OFFSET);
      setNextCursor(nextCursor);
    }
    setIsLoading(false);
  };

  const loadShowcaseAssets = async (
    ownerAddress: NftGalleryProps['ownerAddress'],
    apiKey: NftGalleryProps['openseaApiKey'],
    isProxyApi: NftGalleryProps['isProxyApi'],
    apiUrl: NftGalleryProps['apiUrl'],
    autoRetry: NftGalleryProps['autoRetry']
  ) => {
    setIsLoading(true);
    // Stop if we already have 1000+ items in play.
    const MAX_OFFSET = OPENSEA_API_OFFSET * 20;
    const owner = isEnsDomain(ownerAddress)
      ? await resolveEnsDomain(ownerAddress)
      : ownerAddress;

    let shouldFetch = true;
    let currentCursor = '';

    // Grab all assets of this address to filter down to showcase-only.
    // TODO: optimise this to exit as soon as all showcase items have been resolved.
    while (shouldFetch) {
      const response = await fetchOpenseaAssets({
        owner,
        apiKey,
        isProxyApi,
        apiUrl,
        autoRetry,
        cursor: currentCursor,
      });
      const { assets: rawAssets, hasError, nextCursor } = response;
      if (hasError) {
        setHasError(true);
      } else {
        setAssets((prevAssets) => [...prevAssets, ...rawAssets]);
        if (rawAssets.length !== 0) setIsLoading(false);
        setNextCursor(nextCursor);
        setHasError(hasError);
        // Terminate if hit the global limit or we hit a non-full page (i.e. end of assets).
        if (
          rawAssets.length < OPENSEA_API_OFFSET ||
          currentOffset >= MAX_OFFSET
        ) {
          shouldFetch = false;
          setIsLoading(false);
        }
      }
    }
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

  const onLastItemInView = (isInView: boolean) => {
    if (!hasLoadMoreButton && isInView) {
      setCurrentCursor(nextCursor);
    }
  };

  // TODO: Move into `Lightbox` component once its refactored to being a singleton.
  const handleKeydownEvent = (evt: KeyboardEvent) => {
    const hasActiveLightbox =
      window.location.hash.includes('lightbox-') &&
      window.location.hash !== '#lightbox-untarget';

    if (!hasActiveLightbox) {
      return;
    }

    switch (evt.key) {
      case 'ArrowLeft':
        return decreaseLightboxIndex();
      case 'ArrowRight':
        return increaseLightboxIndex();
      case 'Escape':
        return window.location.assign(`#lightbox-untarget`);
      default:
        break;
    }
  };

  // Handles fetching of assets via OpenSea API.
  useEffect(() => {
    if (showcaseMode) {
      loadShowcaseAssets(
        ownerAddress,
        openseaApiKey,
        isProxyApi,
        apiUrl,
        autoRetry
      );
    } else {
      loadAssets(
        ownerAddress,
        openseaApiKey,
        isProxyApi,
        apiUrl,
        autoRetry,
        currentCursor
      );
    }
  }, [
    showcaseMode,
    ownerAddress,
    openseaApiKey,
    isProxyApi,
    apiUrl,
    currentCursor,
  ]);

  // Isolates assets specified for showcase mode into their own collection whenever `assets` changes.
  useEffect(() => {
    if (assets.length !== 0 && showcaseMode && Array.isArray(showcaseItemIds)) {
      updateShowcaseAssets(assets, showcaseItemIds);
    }
  }, [assets, showcaseMode, showcaseItemIds]);

  // Binds/unbinds keyboard event listeners.
  useEffect(() => {
    document.addEventListener('keydown', handleKeydownEvent);
    return () => {
      document.removeEventListener('keydown', handleKeydownEvent);
    };
  }, [assets, lightboxIndex]);

  const renderSkeletonCards = () =>
    new Array(8)
      .fill(0)
      .map((_, index) => <SkeletonCard key={'placeholder-' + index} />);

  const retryLastRequest = () =>
    loadAssets(
      ownerAddress,
      openseaApiKey,
      isProxyApi,
      apiUrl,
      autoRetry,
      nextCursor
    );

  return (
    <div
      className={joinClassNames(
        darkMode ? 'rnftg-dark' : '',
        'rnftg-h-full rnftg-w-full'
      )}
    >
      {hasError && <RetryButton onClick={retryLastRequest} />}
      <div
        style={galleryContainerStyle}
        className={joinClassNames(
          'rnftg-h-full rnftg-p-6 rnftg-overflow-auto rnftg-bg-gray-50 dark:rnftg-bg-gray-900',
          isInline ? 'rnftg--inline' : ''
        )}
      >
        <div
          className={joinClassNames(
            'rnftg-flex',
            isInline ? 'rnftg-flex-row' : 'rnftg-flex-col'
          )}
        >
          <div
            className={joinClassNames(
              'rnftg-grid rnftg-gap-6',
              isInline
                ? 'rnftg-grid-flow-col'
                : 'rnftg-grid-flow-row rnftg-grid-cols-1 md:rnftg-grid-cols-2 lg:rnftg-grid-cols-3 xl:rnftg-grid-cols-4'
            )}
          >
            {displayedAssets.length === 0 && isLoading
              ? renderSkeletonCards()
              : displayedAssets.map((asset, index) => {
                  const item = (
                    <GalleryItem
                      key={asset.id}
                      index={index}
                      asset={asset}
                      metadataIsVisible={metadataIsVisible}
                      hasLightbox={hasLightbox}
                      setLightboxIndex={setLightboxIndex}
                      increaseLightboxIndex={increaseLightboxIndex}
                      decreaseLightboxIndex={decreaseLightboxIndex}
                      hasExternalLinks={hasExternalLinks}
                      itemContainerStyle={itemContainerStyle}
                      imgContainerStyle={imgContainerStyle}
                    />
                  );
                  const isLastItemInPage =
                    (index + 1) % OPENSEA_API_OFFSET === 0;
                  return isLastItemInPage ? (
                    <InView
                      triggerOnce
                      onChange={onLastItemInView}
                      key={asset.id}
                    >
                      {item}
                    </InView>
                  ) : (
                    item
                  );
                })}
          </div>
          {hasLoadMoreButton && canLoadMore && (
            <LoadMoreButton
              onClick={() => {
                setCurrentCursor(nextCursor);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
