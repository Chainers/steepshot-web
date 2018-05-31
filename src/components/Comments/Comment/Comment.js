import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Avatar from '../../Common/Avatar/Avatar';
import {replyAuthor, setCommentEditState} from '../../../actions/comments';
import Likes from '../../PostsList/Post/Likes/Likes';
import './comment.css';
import Vote from '../../PostsList/Post/Vote/Vote';
import Flag from '../../PostsList/Post/Flag/Flag';
import {deletePost} from '../../../actions/post';
import ShowIf from '../../Common/ShowIf';
import {innerLayout} from '../../../utils/innerLayout';

class Comment extends React.Component {

	componentDidMount() {
		innerLayout(this.props.comment.body, this.commentText);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.comment.body === '*deleted*') this.commentText.innerHTML = '*deleted*';
	}

	editComment() {
    this.props.setCommentEditState(this.props.point, this.props.parentPost, true);
  }

	render() {
		if (!this.props.comment) {
			return null;
		}
		let deleteCommentElement = <span className="delete_comment"
																		 onClick={() => this.props.deleteComment(this.props.point, true)}>Delete
															 </span>;
		if (this.props.comment.postDeleting) {
			deleteCommentElement = <div className="pending-action_comment not-hover_comment">
															 Deleting
															 <span> .</span>
															 <span> .</span>
															 <span> .</span>
														 </div>;
		}
		let money = this.props.comment.total_payout_reward > 0 ?
			<span className="money_comment">{`$${this.props.comment.total_payout_reward}`}</span> : null;
		let commentActions = !this.props.isYourComment
			? <div className="display--flex">
			    <span className="reply_comment"
				   		 onClick={() => this.props.replyAuthor(this.props.author)}>Reply</span>
			    <Flag postIndex={this.props.point}
						 		isComment={true}/>
		    </div>
			: <div className="display--flex">
					{/*<ShowIf show={!this.props.isCommentDeleted && !this.props.cashoutTimeExceed}
									styleContainer={{display: 'flex'}}>
						<span className="edit_comment" onClick={this.editComment.bind(this)}>Edit</span>
						{deleteCommentElement}
					</ShowIf>*/}
				</div>;
		const authorLink = `/@${this.props.author}`;
		return (
			<div className="container_comment" style={{backgroundColor: this.props.isEditing
				? 'rgba(18, 148, 246, 0.05)' : ''}}>
				<div className="head_comment">
						<div className="date">
							<TimeAgo
								datetime={this.props.comment.created}
								locale='en_US'
							/>
						</div>
						<Link to={authorLink} className="user">
							<Avatar src={this.props.comment.avatar}/>
							<div className="name">{this.props.author}</div>
						</Link>
				</div>
				<div className="comment-text">
					<div ref={ref => this.commentText = ref} className="comment-text_comment"/>
					<Vote postIndex={this.props.point}
								powerLikeIndPlace="comment"/>
				</div>
				<div className="actions-buttons_comment">
					{commentActions}
					<div className="display--flex">
						<Likes postIndex={this.props.comment.url} commentAuthor={authorLink}/>
						{money}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let comment = state.posts[props.point];
	const isCommentDeleted = comment.body === '*deleted*';
	const cashoutTimeExceed = new Date(comment.cashout_time) < new Date();
	const parentPost = props.point.replace(/(.+)#.+/, '$1');
	const isEditing = props.point === state.comments[parentPost].editingPostPoint;
	return {
    comment,
    isEditing,
		parentPost,
    isCommentDeleted,
    cashoutTimeExceed,
		author: comment.author,
		isYourComment: comment.author === state.auth.user
	};
};

const mapDispatchToProps = dispatch => {
	return {
		replyAuthor: (name) => {
			dispatch(replyAuthor(name));
		},
		deleteComment: (point, isComment) => {
			dispatch(deletePost(point, isComment))
		},
    setCommentEditState: (point, parentPost, isEditing) => {
      dispatch(setCommentEditState(point, parentPost, isEditing))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
