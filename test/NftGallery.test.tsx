import React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { NftGallery } from '../src/NftGallery';

// @ts-ignore
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ assets: [] }),
  })
);

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    act(() => {
      ReactDOM.render(<NftGallery ownerAddress="" />, div);
    });
    // ReactDOM.unmountComponentAtNode(div);
  });
});
