import {combineReducers} from 'redux';
import messages from './messages';
import auth from './auth';
import posts from './posts';
import admin from './admin';
import localization from './localization';
import search from './search';
import comment from './comment';
import votes from './votes';
import clipboard from './clipboard';
import postsList from './postsList';
import modals from './modals';
import postModal from './postModal';

export default combineReducers({
  clipboard,
  messages,
  auth,
  admin,
  localization,
  posts,
  search,
  comment,
  votes,
  postsList,
  modals,
  postModal
});
