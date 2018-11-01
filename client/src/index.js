import React from 'react';
import ReactDOM from 'react-dom';

import App from './js/App';
import './scss/App.scss';

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();
