import React from 'react';
import {connect} from 'react-redux';
import ShowIf from "../../Common/ShowIf";
import TextInput from "../../Common/TextInput/TextInput";
import Constants from "../../../common/constants";
import {sendComment} from "../../../actions/comments";
import LoadingSpinner from "../../LoadingSpinner";
import {utils} from '../../../utils/utils';
import './commentInput.css';

class CommentInput extends React.Component {

	sendComment() {
		this.props.sendComment(this.props.point, Constants.TEXT_INPUT_POINT.COMMENT);
	}

	render() {
		return (
			<ShowIf show={this.props.isUserAuth}>
				<div className="container_com-inp">
					<TextInput title="Comment"
										 point={Constants.TEXT_INPUT_POINT.COMMENT}
										 multiline={true}
										 smallFont={true}
										 maxHeight={100}
										 disabled={this.props.sendingNewComment}
					/>
					<ShowIf show={!this.props.sendingNewComment}>
						<button type="submit"
										className={'btn_com-inp ' + (this.props.canSent ? 'btn-act_com-inp' : '')}
										onClick={this.sendComment.bind(this)}> Send
						</button>
					</ShowIf>
					<ShowIf show={this.props.sendingNewComment}>
						<LoadingSpinner/>
					</ShowIf>
				</div>
			</ShowIf>
		)
	}
}

const mapStateToProps = (state, props) => {
	return {
		isUserAuth: state.auth.user && state.auth.postingKey,
		...state.comments[props.point],
		canSent: state.textInput[Constants.TEXT_INPUT_POINT.COMMENT] &&
		utils.isNotEmptyString(state.textInput[Constants.TEXT_INPUT_POINT.COMMENT].text)
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		sendComment: (index, point) => {
			dispatch(sendComment(index, point));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(CommentInput);
