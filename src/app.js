import React from 'react';
import {Provider} from 'react-redux';
import {WrapperProvider} from 'create-react-server/wrapper';
import configureStore from './store/configureStore';
import getRoutes, {getServerRouter} from './routes';
import createMemoryHistory from 'history/createMemoryHistory';
import createBrowserHistory from 'history/createBrowserHistory';
import {ConnectedRouter} from 'react-router-redux';
import './styles/main.css';
import './styles/app.css';

export default ({state, props}) => {

	let history = (global.isServerSide) ? createMemoryHistory() : createBrowserHistory();

	const store = configureStore(state, history);

	if (global.isServerSide) {
		return (
			<Provider store={store}>
				<WrapperProvider initialProps={props}>
					{getServerRouter()}
				</WrapperProvider>
			</Provider>
		)
	}

	return (
		<Provider store={store}>
			<ConnectedRouter history={history}>
				{getRoutes()}
			</ConnectedRouter>
		</Provider>
	)
};
