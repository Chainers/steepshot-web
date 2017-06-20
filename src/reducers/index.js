import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import post from './post';
import admin from './admin';
import localization from './localization';

export default combineReducers({
    messages,
    auth,
    admin,
    localization,
    post
});
