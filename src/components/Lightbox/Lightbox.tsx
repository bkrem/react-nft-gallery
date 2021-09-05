import React from 'react';
import { OpenseaAsset } from '../../types/OpenseaAsset';
import { getAssetTitle } from '../../utils';

import './perfundo-lightbox.css';

export interface LightboxProps {
  asset: OpenseaAsset;
  index: number;
  setLightboxIndex: (nextIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  asset,
  index,
  setLightboxIndex,
}) => {
  return (
    <div
      id={`lightbox-${index}`}
      className="perfundo__overlay"
      onClick={() => {
        window.location.assign('#lightbox-untarget');
      }}
    >
      <figure
        className="perfundo__content perfundo__figure"
        onClick={(evt) => {
          // Prevents clicks on the image triggering `#lightbox-untarget`.
          evt.stopPropagation();
        }}
      >
        <img className="perfundo__image" src={asset.image_url} loading="lazy" />
        <div className="rnftg-text-gray-200">
          <div>{getAssetTitle(asset)}</div>
          <div>{asset.collection.name}</div>
        </div>
      </figure>
      <a
        href="#lightbox-untarget"
        className="perfundo__close perfundo__control"
      >
        Close
      </a>
      <a
        className="perfundo__prev perfundo__control"
        onClick={(evt) => {
          evt.stopPropagation();
          setLightboxIndex(index - 1);
        }}
        href={`#lightbox-${index - 1}`}
      >
        Prev
      </a>
      <a
        className="perfundo__next perfundo__control"
        onClick={(evt) => {
          evt.stopPropagation();
          setLightboxIndex(index + 1);
        }}
        href={`#lightbox-${index + 1}`}
      >
        Next
      </a>
    </div>
  );
};
