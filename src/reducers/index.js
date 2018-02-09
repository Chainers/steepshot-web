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
<<<<<<< HEAD
import likesFlagsList from './likesFlagsList';
=======
import likesList from './likesList';
>>>>>>> 20e10e861571a4e77518a61052585441186c32a1
import users from './users';
import bodyParams from './bodyParams';

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
<<<<<<< HEAD
  users,
  bodyParams,
  likesFlagsList,
=======
  likesList,
  users,
  bodyParams
>>>>>>> 20e10e861571a4e77518a61052585441186c32a1
});
