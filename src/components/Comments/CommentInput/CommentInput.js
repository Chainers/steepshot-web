import React from 'react';
import {connect} from 'react-redux';
import ShowIf from '../../Common/ShowIf';
import TextInput from '../../Common/TextInput/TextInput';
import {sendComment} from '../../../actions/comments';
import LoadingSpinner from '../../LoadingSpinner';
import {utils} from '../../../utils/utils';
import './commentInput.css';
import Constants from '../../../common/constants';

class CommentInput extends React.Component {

	sendComment(isEdit) {
		let commentText = this.props.commentValue.comment.text;
		if (!commentText || commentText.replace(/\s+/g, '') === '') return;
		if (!isEdit) {
      this.props.sendComment(this.props.point, Constants.TEXT_INPUT_POINT.COMMENT);
		} /*else {
			this.props.editComment(this.props.point, Constants.TEXT_INPUT_POINT.COMMENT);
		}*/
	}

	render() {
		let buttonState = <button type="submit"
															className={'btn_com-inp ' + (this.props.canSent ? 'btn-act_com-inp' : '')}
															onClick={this.sendComment.bind(this, false)}> Send
											</button>;
		if (this.props.postEditing) {
			buttonState = <button type="submit"
														className={'btn_com-inp ' + (this.props.canSent ? 'btn-act_com-inp' : '')}
														onClick={this.sendComment.bind(this, true)}> Edit
										</button>;
		}
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
						{buttonState}
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
		commentValue: state.textInput,
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
