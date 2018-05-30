import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import App from './components/App';
import NotFound from './components/NotFound';
import PrivateRoute from './components/Routes/PrivateRoute';
import Feed from './components/Feed/Feed';
import AboutComponent from './components/About/AboutComponent';
import Testing from './components/Common/Testing/Testing';
import SinglePost from './components/SinglePost/SinglePost';
import Search from './components/Search/Search';
import EditPost from './components/EditPost/EditPost';
import UserProfile from './components/UserProfile/UserProfile';
import Login from './components/Login/Login';
import {getStore} from './store/configureStore';
import Browse from './components/Browse/Browse';
import Settings from './components/Settings/Settings';
import RouteWithService from "./components/Routes/RouteWithService";

function isAuth() {
	const auth = getStore().getState().auth;
	return !!auth.user && !!auth.postingKey;
}

export default function getRoutes() {
	return (
		<App>
			<Switch>
				<Route exact path="/" render={() => <Redirect to={"/browse"}/>}/>
				<Route exact path="/signin" render={() => (
					isAuth() ? (
						<Redirect push to="/feed"/>
					) : (
						<Login/>
					)
				)}/>
				<Route path="/guide" component={AboutComponent}/>
				<Route path="/dev/test" component={Testing}/>
				<RouteWithService path="/:service?/browse/:filter?" component={Browse}/>
				<RouteWithService path="/:service?/@:username" component={UserProfile}/>
				<RouteWithService path="/:service?/post" component={SinglePost}/>
				<RouteWithService path="/:service?/search/:searchValue" component={Search}/>
				<PrivateRoute path="/:service?/feed" component={Feed}/>
				<Redirect path="/createPost" to={'/editPost'}/>
				<PrivateRoute path="/:service?/editPost/:category?/:username?/:permlink?" component={EditPost}/>
				<PrivateRoute path="/:service?/Profile" component={UserProfile}/>
				<PrivateRoute path="/:service?/settings" component={Settings}/>
				<Route path="*" component={NotFound}/>
			</Switch>
		</App>
	);
}
