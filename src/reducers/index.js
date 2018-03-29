import {combineReducers} from 'redux';
import messages from './messages';
import auth from './auth';
import posts from './posts';
import clipboard from './clipboard';
import usersList from './usersList';
import postsList from './postsList';
import modals from './modals';
import postModal from './postModal';
import tabsBar from './tabsBar';
import likesFlagsList from './likesFlagsList';
import users from './users';
import bodyParams from './bodyParams';
import editPost from './editPost';
import textInput from './textInput';
import avatar from './avatar';

export default combineReducers({
  clipboard,
  messages,
  auth,
  posts,
  tabsBar,
  postsList,
  usersList,
  modals,
  postModal,
  users,
  bodyParams,
  likesFlagsList,
  editPost,
  textInput,
  avatar
});
