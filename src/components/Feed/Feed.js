import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import {documentTitle} from '../DocumentTitle';
import PostsList from '../PostsList/PostsList';
import {addMetaTags} from "../../actions/metaTags";
import {withWrapper} from "create-react-server/wrapper";

class Feed extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		if (!req || location || !store) {
			return {};
		}
		store.dispatch(addMetaTags([{property: 'og:title', content: "steepshot.io"}]));
		store.dispatch(addMetaTags([{property: 'og:type', content: 'website'}]));
		store.dispatch(addMetaTags([{property: 'og:url', content: req.hostname + location.pathname}]));
		await store.dispatch(addMetaTags([{property: 'og:image', content: req.hostname + '/images/steepshotLogo@2x.svg'}]));
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
