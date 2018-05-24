import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Avatar from '../../Common/Avatar/Avatar';
import {replyAuthor} from '../../../actions/comments';
import Likes from '../../PostsList/Post/Likes/Likes';
import './comment.css';
import Vote from '../../PostsList/Post/Vote/Vote';
import Flag from '../../PostsList/Post/Flag/Flag';

class Comment extends React.Component {

	componentDidMount() {
		this.commentsLayout();
	}

	commentsLayout() {
		let safetyScript = this.props.item.body.replace(/<script>|<\/script>/g, '');
		let newLine = safetyScript.replace(/\n/g, '<br>');
		let deletedBotsLayout = newLine.replace(/(!)?\[([^\]]+)?\]/g, '');
		let changeBotsLink = deletedBotsLayout.replace(/\((http(s)?:\/\/[\w\W]+?|www\.[\w\W]+?)\)/g, '$1');
		let linkToImg = changeBotsLink.replace(
			/(http(s)?:\/\/[^\s<>]+?(\.png|\.gif|\.jpg|\.jpeg|\.tif|\.tiff)(\?[\w\W]+?)?(?!"))/gi, '<img src="$1"/>');
		let anyLinks = linkToImg.replace(/<a[\w\W]+?>([\w\W]+?)<\/a>/g, '$1');
		let userLink = anyLinks.replace(/([^/]|^)(@[\w-.]+\w)/g, '$1<a href="/$2" target="_blank">$2</a>');
		this.commentText.innerHTML = userLink;
	}

	render() {
		if (!this.props.item) {
			return null;
		}
		let money = this.props.item.total_payout_reward > 0 ?
			<span className="money_comment">{`$${this.props.item.total_payout_reward}`}</span> : null;
		let commentActions = !this.props.isYourComment
			? <div className="display--flex">
			    <span className="reply_comment"
				   		 onClick={() => this.props.replyAuthor(this.props.author)}>Reply</span>
			    <Flag postIndex={this.props.point}
						 isComment={true}/>
		    </div>
			: <div className="display--flex">
					<span className="edit_comment">Edit</span>
					<span className="delete_comment" onClick={this.deleteComment.bind(this)}>Delete</span>
				</div>;
		const authorLink = `/@${this.props.author}`;
		return (
			<div className="container_comment">
				<div className="head_comment">
						<div className="date">
							<TimeAgo
								datetime={this.props.item.created}
								locale='en_US'
							/>
						</div>
						<Link to={authorLink} className="user">
							<Avatar src={this.props.item.avatar}/>
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
						<Likes postIndex={this.props.item.url} commentAuthor={authorLink}/>
						{money}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let comment = state.posts[props.point];
	return {
		item: comment,
		author: comment.author,
		isYourComment: comment.author === state.auth.user
	};
};

const mapDispatchToProps = dispatch => {
	return {
		replyAuthor: (name) => {
			dispatch(replyAuthor(name));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
