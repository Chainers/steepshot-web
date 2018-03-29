import React from 'react';
import {connect} from 'react-redux';
import {setPowerLikeInd, setHidePowerLikeTimeout} from '../../../../../actions/post';
import {toggleVote} from '../../../../../actions/vote';
import {setLikePower} from '../../../../../actions/auth';
import Slider from 'react-rangeslider';

const CIRCLE_OFFSET = 0;

class VoteIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.hideVoteIndicator = this.hideVoteIndicator.bind(this);
    this.hideWithDelay = this.hideWithDelay.bind(this);
    this.clearDelayTimeout = this.clearDelayTimeout.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.hideVoteIndicator);
    window.addEventListener('touchstart', this.hideVoteIndicator);
    this.powerIndicator.addEventListener('mouseenter', this.clearDelayTimeout);
    this.props.voteButton.addEventListener('mouseenter', this.clearDelayTimeout);
    setTimeout(() => {
      this.props.voteButton.addEventListener('mouseleave', this.hideWithDelay);
    }, 200);
    setTimeout(() => {
      this.powerIndicator.addEventListener('mouseleave', this.hideWithDelay);
    }, 200);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.hideVoteIndicator);
    window.removeEventListener('touchstart', this.hideVoteIndicator);
    this.powerIndicator.removeEventListener('mouseenter', this.clearDelayTimeout);
    this.props.voteButton.removeEventListener('mouseleave', this.hideWithDelay);
    this.props.voteButton.removeEventListener('mouseenter', this.clearDelayTimeout);
    this.powerIndicator.removeEventListener('mouseleave', this.hideWithDelay);
  }

  hideWithDelay() {
    let hidePLIndTimeout = setTimeout(() => {
      if (this.powerIndicator) {
        if (this.props.isPopup) {
          this.powerIndicator.classList.add('hid-popup-ind-anim_vote-ind');
        } else {
          this.powerIndicator.classList.add('hid-ind-anim_vote-ind');
        }
      }
      setTimeout(() => {
        this.props.setPowerLikeInd(this.props.index, false);
      }, 200);
    }, 1500);
    this.props.setHidePowerLikeTimeout(this.props.index, hidePLIndTimeout);
  }

  clearDelayTimeout() {
    clearTimeout(this.props.hplTimeout);
  }

  hideVoteIndicator(e) {
    e.stopPropagation();
    if (this.powerIndicator.contains(e.target)) {
      return;
    }
    this.fluidHide();
  }

  fluidHide() {
    if (this.props.isPopup) {
      this.powerIndicator.classList.add('hid-popup-ind-anim_vote-ind');
    } else {
      this.powerIndicator.classList.add('hid-ind-anim_vote-ind');
    }
    setTimeout(() => {
      this.props.setPowerLikeInd(this.props.index, false);
    }, 200);
  }

  toggleVote() {
    this.fluidHide();
    this.props.toggleVote(this.props.index, this.props.likePower);
  }

  sliderHandleChange = (power) => {
    this.props.setLikePower(power);
  };

  render() {
    let poweroflikeClass = this.props.isPopup ? 'poweroflike-popup-ind_vote-ind' : 'poweroflike-ind_vote-ind';
    return (
      <div className={poweroflikeClass}
           ref={ref => {this.powerIndicator = ref}}
      >
        <div className="poweroflike-amount_vote-ind">{this.props.likePower}%</div>
        <div className="wrapper_vote-ind">
          <div className="slider_vote-ind">
            <Slider
              min={1}
              max={100}
              value={this.props.likePower}
              onChange={this.sliderHandleChange}
            />
          </div>
          <div className="circle-line_vote-ind"/>
          <div className="circle_vote-ind" style={{left: CIRCLE_OFFSET, background: '#ff7500'}}/>
          <div className="circle_vote-ind" style={{right: CIRCLE_OFFSET}}/>
        </div>
        <div className="heart_vote-ind" onClick={this.toggleVote.bind(this)}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...props,
    likePower: state.auth.like_power,
    hplTimeout: state.posts[props.index].hplTimeout
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPowerLikeInd: (postIndex, isOpen) => {
      dispatch(setPowerLikeInd(postIndex, isOpen));
    },
    toggleVote: (postIndex, power) => {
      dispatch(toggleVote(postIndex, power));
    },
    setLikePower: (power) => {
      dispatch(setLikePower(power));
    },
    setHidePowerLikeTimeout: (postIndex, timeout) => {
      dispatch(setHidePowerLikeTimeout(postIndex, timeout))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteIndicator);
