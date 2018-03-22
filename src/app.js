import React from "react";
import {Provider} from "react-redux";
import {WrapperProvider} from "create-react-server/wrapper";
import configureStore from "./store/configureStore";
import getRoutes from './routes';
import './styles/main.css';
import {Router} from "react-router-dom";
import createBrowserHistory from 'history/createBrowserHistory';
import './styles/main.css';
import './styles/posts.css';

const history = createBrowserHistory();

export function getHistory() {
	return history;
}

export default ({state, props}) => {

	const store = configureStore(state);

	return (
		<Provider store={store}>
			<WrapperProvider initialProps={props}>
				<Router history={history}>
					{getRoutes(store)}
				</Router>
			</WrapperProvider>
		</Provider>
	);

};
