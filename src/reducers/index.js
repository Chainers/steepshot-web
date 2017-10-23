import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import post from './post';
import admin from './admin';
import localization from './localization';
import search from './search';
import comment from './comment';
import votes from './votes';

export default combineReducers({
    messages,
    auth,
    admin,
    localization,
    post,
    search,
    comment,
    votes
});
