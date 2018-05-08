import React from 'react';
import {connect} from 'react-redux';
import {setPowerLikeInd, setHidePowerLikeTimeout, setSliderWidth} from '../../../../../actions/post';
import {toggleVote} from '../../../../../actions/vote';
import {setLikePower} from '../../../../../actions/auth';
import Slider from 'react-rangeslider';
import './voteIndicator.css';

class VoteIndicator extends React.Component {

	componentDidMount() {
    this.props.setSliderWidth(this.props.index, this.testRef.clientWidth);
	}

	toggleVote() {
		this.props.toggleVote(this.props.index, this.props.likePower);
    this.props.fluidHide();
	}

	sliderHandleChange = (power) => {
		this.props.setLikePower(power);
	};

	renderDistributionDots() {
		if (this.props.sliderWidth) {
      let NUMBER_OF_PARTS = 4;
      let LINE_WIDTH = this.props.sliderWidth;
      let dots = [];
      let dotOffset = LINE_WIDTH / NUMBER_OF_PARTS - 6 / NUMBER_OF_PARTS;
      for (let i = 0; i < 5; i++) {
        dots.push(<div key={i} className="circle_vote-ind" style={{left: i * dotOffset,
          background: this.props.likePower > i * (99 / NUMBER_OF_PARTS) ? '#ff7500' : '#e6e6e6'}}/>)
      }
      return dots;
		}
	}

	render() {
		return (
			<div className="wrapper_vote-ind">
				<div className="poweroflike-amount_vote-ind">{this.props.likePower}%</div>
				<div className="sub-wrapper_vote-ind" ref={ref => this.testRef = ref}>
					<div className="slider_vote-ind">
						<Slider
							min={1}
							max={100}
							value={this.props.likePower}
							onChange={this.sliderHandleChange}
						/>
					</div>
					<div className="circle-line_vote-ind"/>
					{this.renderDistributionDots()}
				</div>
				<div className="heart_vote-ind" onClick={this.toggleVote.bind(this)}/>
			</div>
		)
	}
}

const mapStateToProps = (state, props) => {
	let post = state.posts[props.index];
	return {
		...props,
		likePower: state.auth.like_power,
		hplTimeout: post.hplTimeout,
		sliderWidth: post.sliderWidth
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
		},
		setHidePowerLikeTimeout: (postIndex, timeout) => {
			dispatch(setHidePowerLikeTimeout(postIndex, timeout))
		},
		setSliderWidth: (postIndex, width) => {
			dispatch(setSliderWidth(postIndex, width))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteIndicator);
