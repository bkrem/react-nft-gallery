import React from 'react';
import { joinClassNames } from '../utils';

export const LoadMoreButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <div className="rnftg-flex rnftg-justify-center rnftg-items-center rnftg-p-6">
      <button
        className={joinClassNames(
          'rnftg-px-4 rnftg-py-2 rnftg-rounded-2xl rnftg-bg-transparent rnftg-text-black dark:rnftg-text-gray-200',
          'rnftg-border rnftg-border-solid rnftg-border-black dark:rnftg-border-gray-200 rnftg-shadow-xl rnftg-cursor-pointer'
        )}
        onClick={onClick}
      >
        Load more
      </button>
    </div>
  );
};
