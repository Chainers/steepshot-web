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
import textInput from "./textInput";
import metaTags from "./metaTags";
import search from "./search";
import editPost from './editPost';
import avatar from './avatar';
import {routerReducer} from "react-router-redux";
import pushNotifications from "./pushNotifications";
import comments from "./comments";
import imagesGallery from "./imagesGallery";
import userProfile from "./userProfile";

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
	avatar,
	metaTags,
	search,
	pushNotifications,
	router: routerReducer,
	comments,
	imagesGallery,
	userProfile
});
