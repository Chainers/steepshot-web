import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Login from './components/Account/Login';
import NotFound from './components/NotFound';
import Localization from './components/Localization/index';
import Signin from './components/Account/Login';
import Signup from './components/Account/Signup';
import UserProfile from './components/UserProfile/index';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };

  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/');
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
    <Route path="/" component={App} onEnter={setLanguages}>
      <IndexRoute component={Home} onLeave={clearMessages} />
      <Route path="/userProfile/:username" component={UserProfile} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path="/signin" component={Signin} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path="*" component={NotFound} onLeave={clearMessages} />
    </Route>
  );
}
