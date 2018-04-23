import React from 'react';
import {connect} from 'react-redux';
import {openModal} from "../../../../actions/modal";
import LikesFlagsList from "../../../LikesFlagsList/LikesFlagsList";
import './likes.css';

class Likes extends React.Component {

	openLikesModal() {
		let modalOption = {
			body: (<LikesFlagsList postIndex={this.props.postIndex} isComment={this.props.isComment}/>),
		};
		this.props.openModal('LikesFlagsList', modalOption);
	}

	render() {
		if (this.props.likes === 0) {
			return <div> </div>;
		}
		return (
			<div className="container_likes"
					 onClick={this.openLikesModal.bind(this)}
					 style={this.props.style}>
				{this.props.likes} {this.props.likes > 1 ? 'likes' : 'like'}
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		likes: state.posts[props.postIndex].net_likes,
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
