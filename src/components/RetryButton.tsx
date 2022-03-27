import React from 'react';
import { joinClassNames } from '../utils';

export const RetryButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <div className="rnftg-flex rnftg-justify-center rnftg-items-center rnftg-p-6 rnftg-fixed rnftg-w-full rnftg-bottom-0 rnftg-left-0 rnftg-bg-red-400 rnftg-box-border">
      <button
        className={joinClassNames(
          'rnftg-px-4 rnftg-py-2 rnftg-rounded-2xl rnftg-bg-transparent rnftg-text-black dark:rnftg-text-gray-200',
          'rnftg-border rnftg-border-solid rnftg-border-black dark:rnftg-border-gray-200 rnftg-shadow-xl rnftg-cursor-pointer'
        )}
        onClick={onClick}
      >
        Couldn't fetch data. Please click to Retry
      </button>
    </div>
  );
};
