import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import App from './components/App';
import Home from './components/Home';
import Login from './components/Account/Login';
import NotFound from './components/NotFound';
import Localization from './components/Localization/index';
import Signin from './components/Account/Login';
import UserProfile from './components/UserProfile/index';
import PrivateRoute from './components/Routes/PrivateRoute';
import Feed from './components/Feed';
import Blog from './components/Blog';
import Account from './components/Account/AccountProfile';

export default function getRoutes(store) {
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };

  function setLanguages(nextState, replace, callback) {
    Localization.getInstance(callback);
  }

  let isUserLogin = !!store.getState().auth.user && !!store.getState().auth.postingKey;

  return (
    <App>
      <Switch>
        <Route exact path="/" render={() => (
          isUserLogin ? (
            <Redirect to="/feed"/>
          ) : (
            <Redirect to="/browse"/>
          )
        )}/>
        <Route path="/browse" component={Home} onLeave={clearMessages} />
        <Route path="/userProfile/:username" component={UserProfile} onLeave={clearMessages} />
        <Route path="/signin" component={Signin} onLeave={clearMessages} />
        <PrivateRoute path="/account" component={Account} onLeave={clearMessages} />
        <PrivateRoute path="/feed" component={Feed} onLeave={clearMessages} />
        <PrivateRoute path="/blog" component={Blog} onLeave={clearMessages} />
        <Route path="*" component={NotFound} onLeave={clearMessages} />
      </Switch>
    </App>
  );
}
