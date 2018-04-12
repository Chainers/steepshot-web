import React from 'react';
import {connect} from 'react-redux';
import ShowIf from "../../Common/ShowIf";
import TextInput from "../../Common/TextInput/TextInput";
import Constants from "../../../common/constants";
import {sendComment} from "../../../actions/comment";
import './commentInput.css';

class CommentInput extends React.Component {

	sendComment(e) {
		e.preventDefault();
		let comment = this.textArea.value;
		if (comment === '') return false;
		this.props.sendComment(this.props.currentIndex, comment);
	}

	render() {
		return (
			<ShowIf show={this.props.isUserAuth}>
				<div className="container_com-inp">
					<TextInput title="Comment"
										 point={Constants.TEXT_INPUT_POINT.COMMENT}
										 multiline={true}
										 smallFont={true}
										 maxHeight={300}/>

					<button type="submit"
									className='btn-submit btn_com-inp'
									onClick={this.sendComment.bind(this)}> Send
					</button>
				</div>
			</ShowIf>
		)
	}
}

const mapStateToProps = (state, props) => {
	return {
		isUserAuth: state.auth.user && state.auth.postingKey,
		post: state.posts[props.point],
		isNotEmpty: state.comments[props.point] && state.comments[props.point].comments.length,
		...state.comments[props.point]
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		sendComment: (index, comment) => {
			dispatch(sendComment(index, comment));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput);
