import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import ClubCards from './components/ClubCards';
import Home from './components/Home';
import Login from './components/Account/Login';
import NotFound from './components/NotFound';
import Login_SigninUp from './components/Account/Login_SigninUp';
import Activies from './components/Activies';
import Shops from './components/SportShops';
import Localization from './components/Localization/index'; 

// SignUps

import SUUser from './components/Account/SingupHow/User';
import SUUClub from './components/Account/SingupHow/Club';
import SUSHO from './components/Account/SingupHow/SHO';
import SUTrainer from './components/Account/SingupHow/Trainer';

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
      <IndexRoute authorize={['user', 'admin', 'trainer', 'club', 'soo']} component={Home} onLeave={clearMessages} />
      <Route path="*" component={NotFound} onLeave={clearMessages} />
    </Route>
  );
}
