import React from 'react';
import {
	Route,
	Redirect
} from 'react-router-dom';
import {connect} from "react-redux";

const PrivateRoute = ({component: Component, ...rest, isAuthenticated}) => (
	<Route {...rest} render={props => (
		isAuthenticated ? (
			<Component {...props}/>
		) : (
			<Redirect to={{
				pathname: '/signin',
				state: {from: props.location}
			}}/>
		)
	)}/>
);

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.user && !!state.auth.postingKey
	}
};

export default connect(mapStateToProps)(PrivateRoute);