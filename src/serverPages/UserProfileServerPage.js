import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import Avatar from '../Common/Avatar/Avatar';
import PostsList from '../PostsList/PostsList';
import UsersList from '../UsersList/UsersList';
import {withWrapper} from 'create-react-server/wrapper';
import {addMetaTags, getDefaultTags} from '../../actions/metaTags';
import {push, replace} from 'react-router-redux';
import TabsBar from '../Common/TabsBar/TabsBar';
import Tab from '../Common/TabsBar/Tab/Tab';
import {getUserProfile, setUserProfileLoading} from '../../actions/userProfile';
import ShowIf from '../Common/ShowIf';
import LoadingSpinner from '../LoadingSpinner';
import './userProfile.css';
import {setActiveIndex} from '../../actions/tabsBar';
import Follow from '../Follow/Follow';
import AuthService from '../../services/AuthService';
import renderHTML from 'react-render-html';
import MarkdownParser from '../../utils/markdownParser';

class UserProfileServerPage extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || !location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	render() {
			return null;
	}
}

export default withWrapper(UserProfileServerPage);
