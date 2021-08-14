import { OpenseaAsset } from './types/OpenseaAsset';

// This avoids adding an extra prod dependency like `cn` just to concatenate classNames.
export const joinClassNames = (...args: string[]) => args.join(' ').trim();

export const getAssetTitle = (asset: OpenseaAsset) =>
  asset.name || `#${asset.token_id}`;
