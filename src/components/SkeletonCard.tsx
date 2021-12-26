import React from 'react';

export const SkeletonCard = () => {
  return (
    <article className="rnftg-item rnftg-rounded-2xl rnftg-bg-white dark:rnftg-bg-gray-800 rnftg-shadow-lg hover:rnftg-shadow-xl rnftg-transition rnftg-duration-300">
      {/* Asset thumbnail img */}
      <div className="rnftg-item__img-wrapper rnftg-rounded-t-2xl rnftg-bg-gray-300 dark:rnftg-bg-gray-600 rnftg-animate-pulse" />
      <div className="rnftg-p-4">
        {/* Asset title */}
        <div className="rnftg-w-1/2 rnftg-h-4 rnftg-bg-gray-300 dark:rnftg-bg-gray-600 rnftg-animate-pulse" />
        {/* Divider */}
        <hr className="rnftg-mx-2 rnftg-my-4 rnftg-border-gray-100 dark:rnftg-border-gray-900 rnftg-animate-pulse" />
        <div className="rnftg-flex rnftg-items-center">
          {/* Collection thumbnail img */}
          <div className="rnftg-w-8 rnftg-h-8 rnftg-mr-2 rnftg-rounded-full rnftg-bg-gray-300 dark:rnftg-bg-gray-600 rnftg-animate-pulse" />
          {/* Collection title */}
          <div className="rnftg-w-1/3 rnftg-h-4 rnftg-bg-gray-300 dark:rnftg-bg-gray-600 rnftg-animate-pulse" />
        </div>
      </div>
    </article>
  );
};
