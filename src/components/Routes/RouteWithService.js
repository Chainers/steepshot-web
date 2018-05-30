import React from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';

const RouteWithService = ({component: Component, rest}) => (
	<Route {...rest} render={props => <Component {...props}/>} />
);

const mapStateToProps = (state) => {
	return {
		isAuthenticated: !!state.auth.user && !!state.auth.postingKey
	}
};

export default connect(mapStateToProps)(RouteWithService);