import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { Router, browserHistory } from 'react-router';
import configureStore from './store/configureStore';
import getRoutes from './routes';
import LocalizedStrings from './components/Localization/index.js';

const store = configureStore(window.INITIAL_STATE);

console.log('browserHistory');
console.log(browserHistory);

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} routes={getRoutes(store)}/>
  </Provider>,
  document.getElementById('content')
);
