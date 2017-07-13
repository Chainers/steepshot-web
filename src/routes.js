import React from 'react';
import { Route, Switch } from 'react-router-dom'
import App from './components/App';
import Home from './components/Home';
import Login from './components/Account/Login';
import NotFound from './components/NotFound';
import Localization from './components/Localization/index';
import Signin from './components/Account/Login';
import UserProfile from './components/UserProfile/index';
import PrivateRoute from './components/Routes/PrivateRoute';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.user) {
      replace('/signin');
    }
  };

  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.user) {
      replace('/feed');
    }
  };

  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };

  function setLanguages(nextState, replace, callback) {
    Localization.getInstance(callback);
  }

  return (
    <App>
      <Switch>
        <Route exact path="/" component={Home} onLeave={clearMessages} />
        <Route path="/userProfile/:username" component={UserProfile} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
        <Route path="/signin" component={Signin} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
        <Route path="/account" component={Signin} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
        <Route path="*" component={NotFound} onLeave={clearMessages} />
      </Switch>
    </App>
  );
}
