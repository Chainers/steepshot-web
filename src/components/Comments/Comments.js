import React from 'react';
import Comment from './Comment/Comment';
import {connect} from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';
import Constants from "../../common/constants";
import ScrollViewComponent from "../Common/ScrollViewComponent";
import ShowIf from "../Common/ShowIf";
import {getPostCommets} from "../../actions/comments";
import Description from "./Description/Description";
import CommentInput from "./CommentInput/CommentInput";
import './comments.css';

class Comments extends React.Component {

	constructor(props) {
		super(props);
		this.props.getComments(this.props.point);
	}

	scrollAfterComment() {
		this.scrollView.scrollBar.scrollToBottom();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.point !== this.props.point) {
			this.props.getComments(nextProps.point);
		}
		return true;
	}

	render() {
		const isMobile = document.documentElement.clientWidth < 815;
		let comments = null;

		if (this.props.loading || !this.props.comments) {
			comments = <LoadingSpinner style={{marginTop: 20}}/>;
		}
		if (this.props.comments && this.props.comments.length > 0) {
			comments = this.props.comments.map((item, index) => {
				return <Comment key={index} item={item}/>
			});
		}
		return (
			<div className="container_comments">
				<div className="test_comments">
					<ScrollViewComponent
						ref={(ref) => this.scrollView = ref}
						wrapperModifier="list-scroll_comments"
						scrollViewModifier="list-scroll-view_comments"
						autoHeight={window.innerWidth < Constants.DISPLAY.DESK_BREAKPOINT}
						autoHeightMax={15000}
						autoHeightMin={100}
						autoHide={true}
						isMobile={isMobile}
					>
						<Description
							title={this.props.post.title}
							tags={this.props.post.tags}
							description={this.props.post.description}
						/>
						<ShowIf show={isMobile}>
							<CommentInput/>
						</ShowIf>
						<div className="list_comments">
							{comments}
						</div>
					</ScrollViewComponent>
				</div>
				<ShowIf show={!isMobile} className='comment-input-big-screen'>
					<CommentInput/>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		isUserAuth: state.auth.user && state.auth.postingKey,
		post: state.posts[props.point],
		...state.comments[props.point]
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getComments: (point) => {
			dispatch(getPostCommets(point))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Comments);
