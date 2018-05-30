import React from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import RouteWithService from "./RouteWithService";

const PrivateRoute = ({component: Component, rest, isAuthenticated}) => (
	isAuthenticated ?	<RouteWithService component={Component} rest={rest}/> :	<Redirect to='/signin' />
);

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.user && !!state.auth.postingKey
	}
};

export default connect(mapStateToProps)(PrivateRoute);