import React from 'react';
import Constants from '../../common/constants';
import {documentTitle} from '../../utils/documentTitle';
import PostsList from '../PostsList/PostsList';
import {connect} from 'react-redux';

class Feed extends React.Component {

	componentDidMount() {
		documentTitle();
	}

	render() {
		return (
			<div className="container">
				<div id="workspace" className="g-content clearfix">
					<PostsList
						point={Constants.POSTS_FILTERS.POSTS_USER_FEED.point}
						wrapperModifier="posts-list clearfix"
					/>
				</div>
			</div>
		);
	}
}


const mapStateToProps = (state) => {
	return {
		username: state.auth.user
	};
};

export default connect(mapStateToProps)(Feed);
