import React from 'react';
import {connect} from 'react-redux';
import {addSinglePost} from '../../actions/post';
import PostModal from '../PostModal/PostModalNew';
import './singlePost.css';
import LoggingService from '../../services/LoggingService';
import PostService from '../../services/PostService';

class SinglePost extends React.Component {

	componentDidMount() {
		if (!Object.keys(this.props.post).length) {
			this.props.addSinglePost(this.props.history.location.pathname);
		}
		let username = this.props.location.pathname.match(/\/@[\w-.]+\//)[0];
		LoggingService.logSharePost(username.replace(/\/@([\w-.]+)\//, '$1'),
			PostService.getPermlinkFromUrl(this.props.location.pathname));
	}

	render() {
		let itemPost;
		if (Object.keys(this.props.post).length !== 0) {
			itemPost = this.props.post[Object.keys(this.props.post)[0]];
			document.title = `@${itemPost.author}: «${itemPost.title}» | Steepshot`;
		}

		if (!this.props.currentIndex) return null;
		return (
			<div className="container_sin-pos">
				<div className="to-center_sin-pos">
					<PostModal />
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state.postModal,
		post: {...state.posts}
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		addSinglePost: url => {
			dispatch(addSinglePost(url));
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePost);
