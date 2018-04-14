import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Avatar from "../../Common/Avatar/Avatar";
import VouteComponent from "../../Posts/VouteComponent";
import {replyAuthor} from "../../../actions/comments";
import {addPosts} from "../../../actions/post";
import Likes from "../../PostsList/Post/Likes/Likes";
import './comment.css';

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
		const authorLink = `/@${this.props.item.author}`;
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
							<div className="name">{this.props.item.author}</div>
						</Link>
				</div>
				<div className="comment-text">
					<div ref={ref => {this.commentText = ref}} className="comment-text_comment"/>
					<VouteComponent
						key="vote"
						item={this.props.item}
						updateVoteInComponent={this.updateVoteInComponent.bind(this)}
						parent='comment'
					/>
				</div>
				<div className="cont-reply_com">
					<span className="rectangle_comment">
						<span onClick={() => this.props.replyAuthor(this.props.item.author)}>Reply</span>
					</span>
					<Likes postIndex={this.props.item.url} disabled={true}/>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		item: state.posts[props.point]
	};
};

const mapDispatchTOProps = dispatch => {
	return {
		replyAuthor: (name) => {
			dispatch(replyAuthor(name));
		},
		updateComment: (newData) => {
			dispatch(addPosts(newData))
		}
	}
};

export default connect(mapStateToProps, mapDispatchTOProps)(Comment);
