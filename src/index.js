import "es6-promise/auto";
import "isomorphic-fetch";
import {render} from "react-dom";
import React from "react";
import {Provider} from "react-redux";
import {WrapperProvider} from "create-react-server/wrapper";
import configureStore from "./store/configureStore";
import getRoutes from './routes';
import './styles/main.css';
import './styles/posts.css';
import {ConnectedRouter} from "react-router-redux";
import createBrowserHistory from 'history/createBrowserHistory';
import createMemoryHistory from 'history/createMemoryHistory';

const history = global.isServerSide ? createMemoryHistory() : createBrowserHistory();
const store = configureStore(window.__INITIAL__STATE__, history);

const Root = () => (
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<WrapperProvider initialProps={window.__INITIAL__PROPS__}>
				{getRoutes(store)}
			</WrapperProvider>
		</ConnectedRouter>
	</Provider>
);

render((<Root/>), document.getElementById('root'));

if (module.hot) module.hot.accept();

