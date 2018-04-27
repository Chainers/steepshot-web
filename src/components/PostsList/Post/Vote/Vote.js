import React from 'react';
import {connect} from 'react-redux';
import {toggleVote} from '../../../../actions/vote';
import Constants from '../../../../common/constants';
import {setPowerLikeInd, setPowerLikeTimeout, setHidePowerLikeTimeout} from '../../../../actions/post';
import {pushMessage} from '../../../../actions/pushMessage';
import VoteIndicator from './VoteIndicator/VoteIndicator';
import ShowIf from '../../../Common/ShowIf';

class Vote extends React.Component {

  constructor(props) {
    super(props);
    this.hideVoteIndicator = this.hideVoteIndicator.bind(this);
    this.clearDelayTimeout = this.clearDelayTimeout.bind(this);
  }

	componentDidMount() {
    this.vote.addEventListener('mouseenter', this.clearDelayTimeout);
    this.vote.addEventListener('mouseenter', () => this.longTapPLInd(1400));
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
      window.addEventListener('touchstart', this.hideVoteIndicator);
      window.addEventListener('mousedown', this.hideVoteIndicator);
    }, timeDelay);
    this.props.setPowerLikeTimeout(this.props.postIndex, plTimeout);
  }

  breakLongTapPLInd(isDesktop) {
    if (isDesktop) {
      if (!this.powerIndicator) {
        clearTimeout(this.props.plTimeout);
      }
      this.hideWithDelay();
      return;
    }
    if (!this.powerIndicator) {
      clearTimeout(this.props.plTimeout);
      this.hideWithDelay();
    }
  }

  hideWithDelay() {
    let hidePLIndTimeout = setTimeout(() => {
      this.fluidHide();
    }, 1400);
    this.props.setHidePowerLikeTimeout(this.props.postIndex, hidePLIndTimeout);
  }

  fluidHide() {
    if (this.powerIndicator) {
      if (this.props.isPopup) {
        this.powerIndicator.classList.add('hid-popup-ind-anim_vote-ind');
      }
      if (this.props.isComment) {
        this.powerIndicator.classList.add('hid-comment-ind-anim_vote-ind');
      }
      this.powerIndicator.classList.add('hid-ind-anim_vote-ind');
    }
    setTimeout(() => {
      this.props.setPowerLikeInd(this.props.postIndex, false);
      window.removeEventListener('touchstart', this.hideVoteIndicator);
      window.removeEventListener('mousedown', this.hideVoteIndicator);
    }, 200);
  }

  hideVoteIndicator(e) {
    e.stopPropagation();
    if (this.vote.contains(e.target)) {
      return;
    }
    this.fluidHide();
  }

  clearDelayTimeout() {
    clearTimeout(this.props.hplTimeout);
  }

	render() {
  	let pLIP = this.props.powerLikeIndPlace;
		let isComment = pLIP === 'comment';
		let buttonClasses = 'btn-like';
		if (isComment) {
      buttonClasses = 'comment btn-like';
		}
		if (this.props.vote) {
			buttonClasses = buttonClasses + ' liked';
		}
		if (this.props.voteLoading) {
			buttonClasses = buttonClasses + ' loading';
		}
    let poweroflikeClass = this.props.isPopup ? 'poweroflike-popup-ind_vote-ind' : isComment ?
      'poweroflike-comment-ind_vote-ind' : 'poweroflike-ind_vote-ind';
		return (
			<div className={isComment ? 'btn-like-wrapper-comment_vote' : 'btn-like-wrapper_vote prevent--selection'}
					 ref={ref => this.vote = ref}
					 onClick={this.toggleVote.bind(this)}
					 onMouseLeave={this.breakLongTapPLInd.bind(this, true)}
					 onTouchStart={this.longTapPLInd.bind(this, 800)}
					 onTouchEnd={this.breakLongTapPLInd.bind(this, false)}
					 onTouchMove={this.breakLongTapPLInd.bind(this, false)}
					 onContextMenu={this.breakLongTapPLInd.bind(this, false)}
					 style={this.props.style}>
				<button type="button" className={buttonClasses}/>
				<ShowIf show={this.props.isModalOpen ? (pLIP === 'modal' || isComment) && this.props.isPLOpen :
          pLIP === 'post' && this.props.isPLOpen}>
					<div className={'poweroflike-common_vote-ind ' + poweroflikeClass}
							 style={this.props.width}
							 ref={ref => this.powerIndicator = ref}
					>
						<VoteIndicator index={this.props.postIndex}
													 isComment={isComment}
													 isPopup={this.props.isPopup}
													 fluidHide={this.fluidHide.bind(this)}/>
					</div>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let post = state.posts[props.postIndex];
	return {
		...post,
		...props,
		isModalOpen: Object.keys(state.modals).length > 0,
		isPLOpen: post.isPLOpen,
		plTimeout: post.plTimeout,
    hplTimeout: post.hplTimeout,
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
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		},
    setHidePowerLikeTimeout: (postIndex, timeout) => {
      dispatch(setHidePowerLikeTimeout(postIndex, timeout))
    }
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
