import React from 'react';
import {
	Route,
	Redirect
} from 'react-router-dom';
import fakeAuth from './fakeAuth';

const PrivateRoute = ({component: Component, ...rest}) => (
	<Route {...rest} render={props => (
		fakeAuth.isAuthenticated ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/signin',
				state: {from: props.location}
			}}/>
		)
	)}/>
);

export default PrivateRoute;