'use strict';
import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import className from 'react-classnames';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import getRoutes from './routes';
import LocalizedStrings from './components/Localization/index.js';
// import { Router } from 'react-router'
import { BrowserRouter, Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import jQuery from 'jquery';
import { jqApp } from '../static/libs/app.min.js';

window.$ = window.jQuery = jQuery;

const history = createBrowserHistory();

const store = configureStore(window.INITIAL_STATE);

const location = window.location.pathname;

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('content')
);
