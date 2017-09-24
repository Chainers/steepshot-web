import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import getRoutes from './routes';
import LocalizedStrings from './components/Localization/index.js';
// import { Router } from 'react-router'
import { BrowserRouter, Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

const history = createBrowserHistory();

const store = configureStore(window.INITIAL_STATE);

const location = window.location.pathname;

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      {getRoutes(store)}
    </BrowserRouter>
  </Provider>,
  document.getElementById('content')
);
