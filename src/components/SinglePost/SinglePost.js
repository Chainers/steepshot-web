import React from 'react';
import {connect} from 'react-redux';
import {addSinglePost} from '../../actions/post';
import PostModal from '../PostModal/PostModal';
import {logSharePost} from '../../actions/logging';
import './singlePost.css';

class SinglePost extends React.Component {
	constructor(props) {
		super(props);
		this.props.addSinglePost(this.props.location.pathname);
	}

	componentDidMount() {
		const urlObject = this.props.location.pathname.split('/');
		let permlink = urlObject[urlObject.length - 1];
		let username = this.props.location.pathname.match(/\/@[\w-.]+\//)[0];
		const data = JSON.stringify({
			action: 'share_post',
			error: ''
		});
		logSharePost(username.replace(/\/@([\w-.]+)\//, '$1'), permlink, data);
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		let itemPost;
		if (Object.keys(this.props.post).length !== 0) {
			itemPost = this.props.post[Object.keys(this.props.post)[0]];
			document.title = `@${itemPost.author}: «${itemPost.title}» | Steepshot`;
		}

		if (!this.props.currentIndex) return null;
		return (
			<div className="container_sin-pos">
				<div className="to-center_sin-pos">
					<PostModal showClose={false} singlePost={true}/>
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
