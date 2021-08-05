import React from 'react';
import { NftGalleryProps } from '../NftGallery';

export interface GalleryItemProps {
  asset: any;
  metadataIsVisible: NftGalleryProps['metadataIsVisible'];
}

export const GalleryItem: React.FC<GalleryItemProps> = ({
  asset,
  metadataIsVisible,
}) => {
  return (
    <article className="rounded-2xl bg-white dark:bg-gray-800">
      <div>
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
          <hr className="mx-2 my-4 border-gray-100 dark:border-gray-900" />
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
