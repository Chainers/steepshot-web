import React from 'react';
import {connect} from 'react-redux';
import {addVoteElement, toggleVote} from '../../../../actions/vote';
import Constants from '../../../../common/constants';
import {setPowerLikeInd, setPowerLikeTimeout} from '../../../../actions/post';
import {pushMessage} from "../../../../actions/pushMessage";

class Vote extends React.Component {

	componentDidMount() {
		this.props.addVoteElement(this.props.postIndex, this.vote);
	}

	toggleVote() {
    if (!this.props.isUserAuth) {
      this.props.pushMessage(Constants.VOTE_ACTION_WHEN_NOT_AUTH);
      return;
    }
		if (this.props.isPLOpen) {
			return;
		}
		this.props.toggleVote(this.props.postIndex);
		clearTimeout(this.props.plTimeout);
	}

  longTapPLInd(timeDelay) {
    if (this.props.vote) {
      return;
    }
    if (!this.props.isUserAuth) {
      return;
    }
    if (this.props.isPLOpen) {
      return;
    }
    let plTimeout = setTimeout(() => {
      this.props.setPowerLikeInd(this.props.postIndex, true, this.props.powerLikeIndPlace);
    }, timeDelay);
    this.props.setPowerLikeTimeout(this.props.postIndex, plTimeout);
  }

  breakLongTapPLInd() {
    clearTimeout(this.props.plTimeout);
  }

	render() {
		let buttonClasses = 'btn-like';
		if (this.props.isComment) {
      buttonClasses = 'comment btn-like';
		}
		if (this.props.vote) {
			buttonClasses = buttonClasses + ' liked';
		}
		if (this.props.voteLoading) {
			buttonClasses = buttonClasses + ' loading';
		}
		let style = this.props.style ? this.props.style : null;
		return (
			<div className={this.props.isComment ? 'btn-like-wrapper-comment_vote' : 'btn-like-wrapper_vote'}
					 ref={ref => this.vote = ref}
					 onClick={this.toggleVote.bind(this)}
					 onMouseEnter={this.longTapPLInd.bind(this, 1400)}
					 onMouseLeave={this.breakLongTapPLInd.bind(this)}
					 onTouchStart={this.longTapPLInd.bind(this, 800)}
					 onTouchEnd={this.breakLongTapPLInd.bind(this)}
					 onTouchMove={this.breakLongTapPLInd.bind(this)}
					 onContextMenu={this.breakLongTapPLInd.bind(this)}
					 style={style}>
				<button type="button" className={buttonClasses}/>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let post = state.posts[props.postIndex];
	return {
		post,
		...post,
		...props,
		isPLOpen: post.isPLOpen,
		plTimeout: post.plTimeout,
    isUserAuth: !!state.auth.user && !!state.auth.postingKey
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleVote: (postIndex) => {
			dispatch(toggleVote(postIndex));
		},
    setPowerLikeInd: (postIndex, isOpen, place) => {
      dispatch(setPowerLikeInd(postIndex, isOpen, place));
    },
    setPowerLikeTimeout: (postIndex, plTimeout) => {
      dispatch(setPowerLikeTimeout(postIndex, plTimeout));
    },
    addVoteElement: (postIndex, voteElement) => {
			dispatch(addVoteElement(postIndex, voteElement));
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
