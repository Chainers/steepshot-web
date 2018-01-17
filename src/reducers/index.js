import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import post from './post';
import admin from './admin';
import localization from './localization';
import search from './search';
import comment from './comment';
import votes from './votes';
import clipboard from "./clipboard";
import postsList from './postsList';

export default combineReducers({
    clipboard,
    messages,
    auth,
    admin,
    localization,
    post,
    search,
    comment,
    votes,
    postsList
});
