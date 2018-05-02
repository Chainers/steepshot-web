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
import {getStore} from "./store/configureStore";

export function baseBrowseFilter() {
	return localStorage.getItem('browse') || Constants.BROWSE_ROUTES[0].NAME;
}

export default function getRoutes() {
	return (
		<App>
			<Switch>
				<Route exact path="/" render={() => (
					!!getStore().getState().auth.user && !!getStore().getState().auth.postingKey ? (
						<Redirect to="/feed"/>
					) : (
						<Redirect to={`/browse/${baseBrowseFilter()}`}/>
					)
				)}/>
				<Route exact path="/signin" render={() => (
					!!getStore().getState().auth.user && !!getStore().getState().auth.postingKey ? (
						<Redirect push to="/feed"/>
					) : (
						<Login/>
					)
				)}/>
				<Route path="/browse/:filter" component={BrowseWrapper} />
				<Redirect path="/browse" to={`/browse/${baseBrowseFilter()}`}/>
				<Route path="/@:username" component={UserProfile} />
				<Route path="/post" component={SinglePost} />
				<Route path="/search/:searchValue" component={Search} />
				<Route path="/guide" component={AboutComponent} />
				<Route path="/dev/test" component={Testing} />
				<PrivateRoute path="/feed" component={Feed} />
				<Redirect path="/createPost" to={'/editPost'}/>
				<PrivateRoute path="/editPost/:category?/:username?/:postId?" component={EditPost} />
				<PrivateRoute path="/Profile" component={UserProfile} />
				<PrivateRoute path="/settings" component={Settings} />
				<Route path="*" component={NotFound} />
			</Switch>
		</App>
	);
}
