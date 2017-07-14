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
import Feed from './components/Feed';
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

  return (
    <App>
      <Switch>
        <Route exact path="/" component={Home} onLeave={clearMessages} />
        <Route path="/userProfile/:username" component={UserProfile} onLeave={clearMessages} />
        <Route path="/signin" component={Signin} onLeave={clearMessages} />
        <PrivateRoute path="/account" component={Account} onLeave={clearMessages} />
        <PrivateRoute path="/feed" component={Feed} onLeave={clearMessages} />
        <Route path="*" component={NotFound} onLeave={clearMessages} />
      </Switch>
    </App>
  );
}
