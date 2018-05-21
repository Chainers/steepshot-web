import React from 'react';
import {connect} from 'react-redux';
import {openModal} from "../../../../actions/modal";
import LikesFlagsList from "../../../LikesFlagsList/LikesFlagsList";
import './likes.css';

class Likes extends React.Component {

	openLikesModal() {
		let modalOption = {
			body: (<LikesFlagsList postIndex={this.props.postIndex}
														 commentAuthor={this.props.commentAuthor}/>),
		};
		this.props.openModal('LikesFlagsList', modalOption);
	}

	render() {
		if (this.props.likes === 0 && !this.props.flags) {
			return <div> </div>;
		}
		let likeFlag;
		if (this.props.likes > 0 || this.props.votes > 0) {
      likeFlag = <span>{this.props.likes} {this.props.likes > 1 ? ' likes' : ' like'}</span>;
		} else {
      likeFlag = <span>{this.props.flags} {this.props.flags > 1 ? ' flags' : ' flag'}</span>;
		}
		return (
			<div className="container_likes"
					 onClick={this.openLikesModal.bind(this)}
					 style={this.props.style}>
				{likeFlag}
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let post = state.posts[props.postIndex];
	return {
		likes: post.net_likes,
		flags: post.net_flags,
		votes: post.net_votes
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		openModal: (index, options) => {
			dispatch(openModal(index, options));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Likes);
