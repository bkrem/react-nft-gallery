import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { NftGallery } from '../.';

const App = () => {
  return (
    <div>
      <NftGallery ownerAddress="" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
