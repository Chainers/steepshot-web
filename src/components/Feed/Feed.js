import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import {documentTitle} from '../DocumentTitle';
import PostsList from '../PostsList/PostsList';
import {addMetaTags, getDefaultTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";

class Feed extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || location || !store) {
			return {};
		}
		await store.dispatch(addMetaTags(getDefaultTags(req.hostname, location.pathname)));
		return {};
	}

	constructor() {
		super();
		this.state = {
			point: Constants.POSTS_FILTERS.POSTS_USER_FEED.point
		};
	}

	componentDidMount() {
		documentTitle();
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="g-main_i container">
				<div id="workspace" className="g-content clearfix">
					<PostsList
						point={this.state.point}
						cancelPrevious={false}
						wrapperModifier="posts-list clearfix"
					/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		localization: state.localization
	};
};

export default withWrapper(connect(mapStateToProps)(Feed));
