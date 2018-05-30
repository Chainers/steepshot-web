import React from 'react';
import {
	Route,
	Redirect
} from 'react-router-dom';
import {connect} from 'react-redux';

const PrivateRoute = ({component: Component, rest, isAuthenticated}) => (
	isAuthenticated ?	<Route {...rest} render={props => <Component {...props}/>} /> :	<Redirect to='/signin' />
);

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.user && !!state.auth.postingKey
	}
};

export default connect(mapStateToProps)(PrivateRoute);