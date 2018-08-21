import React from 'react';
import {withWrapper} from 'create-react-server/wrapper';
import Utils from '../utils/Utils';
import {addMetaTags, getTags} from '../actions/metaTags';
import {addSinglePost} from '../actions/post';

class SinglePost extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!global.isServerSide) return {};
		await store.dispatch(addSinglePost(location.pathname));
		if (!req || !store || !location) {
			return {};
		}
		const post = Utils.getFirstObjectField(store.getState().posts);
		await store.dispatch(addMetaTags(getTags(post.title, req.hostname + location.pathname, post.media[0].url)));
		return {};
	}

	render() {
		return null;
	}
}

export default withWrapper(SinglePost);
