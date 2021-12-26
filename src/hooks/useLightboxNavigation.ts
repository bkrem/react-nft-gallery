import { useState } from 'react';

export const useLightboxNavigation = (maxIndex: number) => {
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const decreaseLightboxIndex = () => {
    // Do nothing if we're at minimum index already.
    if (lightboxIndex === 0) return;
    const nextIndex = lightboxIndex - 1;
    setLightboxIndex(nextIndex);
    window.location.replace(`#lightbox-${nextIndex}`);
  };

  const increaseLightboxIndex = () => {
    // Do nothing if we're at maximum index already.
    if (lightboxIndex === maxIndex) return;
    const nextIndex = lightboxIndex + 1;
    setLightboxIndex(nextIndex);
    window.location.replace(`#lightbox-${nextIndex}`);
  };

  return {
    lightboxIndex,
    setLightboxIndex,
    increaseLightboxIndex,
    decreaseLightboxIndex,
  };
};
