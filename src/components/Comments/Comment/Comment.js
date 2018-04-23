import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Avatar from '../../Common/Avatar/Avatar';
import {replyAuthor} from '../../../actions/comments';
import {addPosts} from '../../../actions/post';
import Likes from '../../PostsList/Post/Likes/Likes';
import './comment.css';
import Vote from '../../PostsList/Post/Vote/Vote';
import ShowIf from '../../Common/ShowIf';
import Flag from '../../PostsList/Post/Flag/Flag';
import VoteIndicator from '../../PostsList/Post/Vote/VoteIndicator/VoteIndicator';

class Comment extends React.Component {

	updateVoteInComponent(vote) {
		let newItem = this.props.item;
		vote ? newItem.net_votes++ : newItem.net_votes--;
		vote ? newItem.net_likes++ : newItem.net_likes--;
		newItem.vote = vote;
		this.props.updateComment({
			[this.props.point]: newItem
		});
	}

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
		let userLink = anyLinks.replace(/(@[\w-.]+\w)/g, '<a href="/$1" target="_blank">$1</a>');
		this.commentText.innerHTML = userLink;
	}

	render() {
		if (!this.props.item) {
			return null;
		}
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
					<ShowIf show={this.props.item.isPLOpen && this.props.item.powerLikeIndPlace === 'comment'}>
						<VoteIndicator index={this.props.point} isComment={true}/>
					</ShowIf>
					<div ref={ref => this.commentText = ref} className="comment-text_comment"/>
					<Vote postIndex={this.props.point}
								powerLikeIndPlace="comment"
								isComment={true}/>
				</div>
				<div className="actions-buttons_comment">
					<ShowIf show={!this.props.isYourComment} className="display--flex">
						<span className="reply_comment" onClick={() => this.props.replyAuthor(this.props.author)}>Reply</span>
						<Flag postIndex={this.props.point}
									isComment={true}/>
					</ShowIf>
					<Likes postIndex={this.props.item.url} isComment={true}/>
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
		},
		updateComment: (newData) => {
			dispatch(addPosts(newData))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
