import React from 'react';
import * as ReactDOM from 'react-dom';
import { NftGallery } from '../src/NftGallery';

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<NftGallery ownerAddress="" />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
