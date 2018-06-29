import React from 'react';
import {connect} from 'react-redux';
import {toggleVote} from '../../../../actions/vote';
import Constants from '../../../../common/constants';
import {setPowerLikeInd, setPowerLikeTimeout, setHidePowerLikeTimeout} from '../../../../actions/post';
import {pushMessage} from '../../../../actions/pushMessage';
import VoteIndicator from './VoteIndicator/VoteIndicator';
import ShowIf from '../../../Common/ShowIf';
import './vote.css';
import AuthService from '../../../../services/authService';

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
    if (!this.props.isAuth) {
      this.props.pushMessage(Constants.VOTE_ACTION_WHEN_NOT_AUTH);
      return;
    }
		if (this.props.isPLOpen || this.props.commentDeleted) {
			return;
		}
		this.props.toggleVote(this.props.postIndex);
		clearTimeout(this.props.plTimeout);
	}

  longTapPLInd(timeDelay) {
    if (!this.props.isUserAuth) {
      return;
    }
    if (this.props.vote || !this.props.isAuth || this.props.isPLOpen || this.props.commentDeleted) {
      return;
    }
    let plTimeout = setTimeout(() => {
      this.props.setPowerLikeInd(this.props.postIndex, true);
      window.addEventListener('touchstart', this.hideVoteIndicator);
      window.addEventListener('mousedown', this.hideVoteIndicator);
    }, timeDelay);
    this.props.setPowerLikeTimeout(this.props.postIndex, plTimeout);
  }

  breakLongTapPLInd(isDesktop) {
    if (this.props.commentDeleted) {
      return;
    }
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
    if (!this.props.isUserAuth) {
      return;
    }
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
    if (this.powerIndicator && this.powerIndicator.contains(e.target)) {
      return;
    }
    if (this.vote && this.vote.contains(e.target) && !this.powerIndicator.contains(e.target)) {
      this.props.toggleVote(this.props.postIndex);
    }
    this.fluidHide();
  }

  clearDelayTimeout() {
    clearTimeout(this.props.hplTimeout);
  }

  styleVoteInd() {
    const VOTE_IND_LUMP = 10;
    if (this.vote) {
      let postWidth = this.vote.parentNode.parentNode.parentNode.clientWidth;
      if (this.props.isPost) {
        let voteIndWidth = (postWidth) + 2 * VOTE_IND_LUMP + 2;
        return {width: voteIndWidth, right: -VOTE_IND_LUMP};
      }
      if (this.props.isPopup) return {width: postWidth, right: 0};
      if (this.props.isComment) return {width: postWidth, right: -VOTE_IND_LUMP * 2};
    }
  }

	render() {
		let buttonClasses = 'btn-like_vote', wrapperClass = 'btn-like-wrapper_vote';
		if (this.props.isComment) {
      buttonClasses = 'comment btn-like_vote';
      if (this.props.commentDeleted) {
        buttonClasses = `comment btn-like-inactive_vote ${this.props.vote ? 'comment-liked_vote' : 'comment-not-liked_vote'}`;
      }
      wrapperClass = 'btn-like-wrapper-comment_vote';
		}
		if (this.props.vote) {
			buttonClasses = buttonClasses + ' liked_vote';
		}
		if (this.props.voteLoading) {
			buttonClasses = buttonClasses + ' loading_vote';
			wrapperClass = wrapperClass + ' loading_vote';
		}
    let poweroflikeClass = this.props.isPopup ? 'poweroflike-popup-ind_vote-ind' : this.props.isComment ?
      'poweroflike-comment-ind_vote-ind' : 'poweroflike-ind_vote-ind';
		let showSlider = (this.props.isModalOpen || this.props.singlePost) ? this.props.isPopup && this.props.isPLOpen :
      this.props.isPost && this.props.isPLOpen;
		if (this.props.isComment) {
      showSlider = this.props.isPLOpen;
    }
		return (
			<div className={wrapperClass}
					 ref={ref => this.vote = ref}
					 onClick={this.toggleVote.bind(this)}
					 onMouseLeave={this.breakLongTapPLInd.bind(this, true)}
					 onTouchStart={this.longTapPLInd.bind(this, 800)}
					 onTouchEnd={this.breakLongTapPLInd.bind(this, false)}
					 onTouchMove={this.breakLongTapPLInd.bind(this, false)}
					 onContextMenu={this.breakLongTapPLInd.bind(this, false)}
					 style={this.props.isPopup ? {paddingRight: 20} : null}>
				<button type="button" className={buttonClasses}/>
				<ShowIf show={showSlider}>
					<div className={'poweroflike-common_vote-ind ' + poweroflikeClass}
							 ref={ref => this.powerIndicator = ref}
               style={this.styleVoteInd()}
					>
						<VoteIndicator index={this.props.postIndex}
													 fluidHide={this.fluidHide.bind(this)}/>
					</div>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let post = state.posts[props.postIndex];
  let powerLikeIndPlace = props.powerLikeIndPlace;
  let isComment = powerLikeIndPlace === 'comment';
  let isPost = powerLikeIndPlace === 'post';
  let isPopup = powerLikeIndPlace === 'modal';
	return {
		...post,
		...props,
    isComment,
    isPost,
    isPopup,
    isUserAuth: state.auth.user !== null,
		isModalOpen: Object.keys(state.modals).length > 0,
		isPLOpen: post.isPLOpen,
		plTimeout: post.plTimeout,
    hplTimeout: post.hplTimeout,
    isAuth: AuthService.isAuth()
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleVote: (postIndex) => {
			dispatch(toggleVote(postIndex));
		},
    setPowerLikeInd: (postIndex, isOpen) => {
      dispatch(setPowerLikeInd(postIndex, isOpen));
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
