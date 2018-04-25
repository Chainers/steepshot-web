import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import App from './components/App';
import NotFound from './components/NotFound';
import PrivateRoute from './components/Routes/PrivateRoute';
import Feed from './components/Feed/Feed';
import Settings from './components/Settings';
import AboutComponent from './components/About/AboutComponent';
import BrowseWrapper from './components/Wrappers/BrowseWrapper';
import Constants from './common/constants';
import Testing from './components/Common/Testing/Testing';
import SinglePost from './components/SinglePost/SinglePost';
import Search from './components/Search/Search';
import EditPost from './components/EditPost/EditPost';
import UserProfile from "./components/UserProfile/UserProfile";
import Login from "./components/Login/Login";

export function baseBrowseFilter() {
	return localStorage.getItem('browse') || Constants.BROWSE_ROUTES[0].NAME;
}

export default function getRoutes(store) {
	const clearMessages = () => {
		store.dispatch({
			type: 'CLEAR_MESSAGES'
		});
	};

	const auth = store.getState().auth;
	const isAuth = !!auth.user && !!auth.postingKey && auth.isSetAuth;

	return (
		<App>
			<Switch>
				<Route exact path="/" render={() => (
					isAuth ? (
						<Redirect to="/feed"/>
					) : (
						<Redirect to={`/browse/${baseBrowseFilter()}`}/>
					)
				)}/>
				<Route exact path="/signin" render={() => (
					isAuth ? (
						<Redirect push to="/feed"/>
					) : (
						<Login/>
					)
				)}/>
				<Route path="/browse/:filter" component={BrowseWrapper} onLeave={clearMessages}/>
				<Redirect path="/browse" to={`/browse/${baseBrowseFilter()}`}/>
				<Route path="/@:username" component={UserProfile} onLeave={clearMessages}/>
				<Route path="/signin" component={Login} onLeave={clearMessages}/>
				<Route path="/post" component={SinglePost} onLeave={clearMessages}/>
				<Route path="/search/:searchValue" component={Search} onLeave={clearMessages}/>
				<Route path="/guide" component={AboutComponent} onLeave={clearMessages}/>
				<Route path="/dev/test" component={Testing} onLeave={clearMessages}/>
				<PrivateRoute path="/feed" component={Feed} onLeave={clearMessages}/>
				<Redirect path="/createPost" to={'/editPost'}/>
				<PrivateRoute path="/editPost/:category?/:username?/:postId?" component={EditPost} onLeave={clearMessages}/>
				<PrivateRoute path="/Profile" component={UserProfile} onLeave={clearMessages}/>
				<PrivateRoute path="/settings" component={Settings} onLeave={clearMessages}/>
				<Route path="*" component={NotFound} onLeave={clearMessages}/>
			</Switch>
		</App>
	);
}
