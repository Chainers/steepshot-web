import React from 'react';
import {connect} from 'react-redux';
import {setChangeStatus, setSliderWidth} from '../../../../../actions/post';
import {toggleVote} from '../../../../../actions/vote';
import {setLikePower} from '../../../../../actions/auth';
import Slider from 'react-rangeslider';
import './voteIndicator.css';

class VoteIndicator extends React.Component {

	componentDidMount() {
		this.props.setSliderWidth(this.props.index, this.slider.clientWidth);
	}

  boundingToPartClick(e) {
		if (e.target.className === 'rangeslider__handle') {
			return;
		}
		let clickCoordinateX = e.pageX - this.slider.getBoundingClientRect().left;
		let targetDot = (clickCoordinateX / this.props.sliderWidth) * 100;
		let installingValue;
		if (targetDot <= 13.5) {
			installingValue = 1;
		}
		if (targetDot <= 37.5 && targetDot >= 13.6) {
      installingValue = 25;
		}
    if (targetDot <= 62.5 && targetDot >= 37.6) {
      installingValue = 50;
    }
    if (targetDot <= 87.5 && targetDot >= 62.6) {
      installingValue = 75;
    }
    if (targetDot >= 87.6) {
      installingValue = 100;
    }
		this.props.setLikePower(installingValue);
	}

	toggleVote() {
		this.props.toggleVote(this.props.index, this.props.likePower);
    this.props.fluidHide();
	}

	sliderHandleChange = (power) => {
		if (power !== this.props.likePower && this.props.changeStatus) this.props.setLikePower(power);
	};

	renderDistributionDots() {
		if (this.props.sliderWidth) {
      const NUMBER_OF_PARTS = 4, DOT_DIAMETER = 6, LINE_WIDTH = this.props.sliderWidth;
      let dots = [];
      let dotOffset = LINE_WIDTH / NUMBER_OF_PARTS - DOT_DIAMETER / NUMBER_OF_PARTS;
      for (let i = 0; i < NUMBER_OF_PARTS + 1; i++) {
        dots.push(
					<div key={i} className="circle_vote-ind" style={{left: i * dotOffset,
						background: this.props.likePower > i * (99 / NUMBER_OF_PARTS) ? '#ff7500' : '#e6e6e6'}}/>
				)
      }
      return dots;
		}
	}

	setChangeStatus(param) {
		this.props.setChangeStatus(this.props.index, param);
	}

	render() {
		return (
			<div className="wrapper_vote-ind">
				<div className="poweroflike-amount_vote-ind">{this.props.likePower}%</div>
				<div className="sub-wrapper_vote-ind">
					<div className="slider_vote-ind" onClick={(e) => this.boundingToPartClick(e)} ref={ref => this.slider = ref}>
						<Slider
							min={1}
							max={100}
							value={this.props.likePower}
							onChange={this.sliderHandleChange}
							onChangeStart={this.setChangeStatus.bind(this, true)}
							onChangeComplete={this.setChangeStatus.bind(this, false)}
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
		sliderWidth: post.sliderWidth,
		changeStatus: post.changeStatus
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		toggleVote: (postIndex) => {
			dispatch(toggleVote(postIndex));
		},
		setLikePower: (power) => {
			dispatch(setLikePower(power));
		},
		setSliderWidth: (postIndex, width) => {
			dispatch(setSliderWidth(postIndex, width))
		},
    setChangeStatus: (postIndex, param) => {
			dispatch(setChangeStatus(postIndex, param))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteIndicator);
