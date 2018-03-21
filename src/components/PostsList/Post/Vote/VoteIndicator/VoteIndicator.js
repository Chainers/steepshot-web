import React from 'react';
import {connect} from 'react-redux';
import {setPowerLikeInd} from '../../../../../actions/post';
import {toggleVote} from '../../../../../actions/vote';
import {setLikePower} from '../../../../../actions/auth';
import Slider from 'react-rangeslider';

const CIRCLE_OFFSET = 0;

class VoteIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.hideVoteIndicator = this.hideVoteIndicator.bind(this);
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.hideVoteIndicator);
    window.addEventListener('touchstart', this.hideVoteIndicator);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.hideVoteIndicator);
    window.removeEventListener('touchstart', this.hideVoteIndicator);
  }

  hideVoteIndicator(e) {
    e.stopPropagation();
    if (this.powerIndicator.contains(e.target)) {
      return;
    }
    this.powerIndicator.classList.add('hid-ind-anim_vote-ind');
    setTimeout(() => {
      this.props.setPowerLikeInd(this.props.index, false);
    }, 200);
  }

  toggleVote() {
    this.props.toggleVote(this.props.index);
    this.props.setPowerLikeInd(this.props.index, false);
  }

  sliderHandleChange = (power) => {
    this.props.setLikePower(power);
  };

  render() {
    return (
      <div className="poweroflike-ind_vote-ind"
           ref={ref => {this.powerIndicator = ref}}
      >
        <div className="poweroflike-amount_vote-ind">{this.props.likePower}%</div>
        {/*<div className="ind-line_vote-ind">*/}
          {/*<div className="toggler-wrapper_vote-ind">*/}
            {/*<div className="circle-toggler_vote-ind"/>*/}
          {/*</div>*/}
          {/*<div className="circle_vote-ind" style={{left: CIRCLE_OFFSET}}/>*/}
          {/*<div className="circle_vote-ind" style={{right: CIRCLE_OFFSET}}/>*/}
        {/*</div>*/}
        <div className='slider_vote-ind'>
          <Slider
            min={1}
            max={100}
            value={this.props.likePower}
            onChange={this.sliderHandleChange}
          />
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
    likePower: state.auth.like_power
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPowerLikeInd: (postIndex, isOpen) => {
      dispatch(setPowerLikeInd(postIndex, isOpen));
    },
    toggleVote: (postIndex) => {
      dispatch(toggleVote(postIndex));
    },
    setLikePower: (power) => {
      dispatch(setLikePower(power));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteIndicator);
