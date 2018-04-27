import React from 'react';
import {connect} from 'react-redux';
import {setPowerLikeInd, setHidePowerLikeTimeout} from '../../../../../actions/post';
import {toggleVote} from '../../../../../actions/vote';
import {setLikePower} from '../../../../../actions/auth';
import Slider from 'react-rangeslider';
import './voteIndicator.css';

const CIRCLE_OFFSET = 0;

class VoteIndicator extends React.Component {

	toggleVote() {
		this.props.toggleVote(this.props.index, this.props.likePower);
    this.props.fluidHide();
	}

	sliderHandleChange = (power) => {
		this.props.setLikePower(power);
	};

	render() {
		return (
			<div className="wrapper_vote-ind">
				<div className="poweroflike-amount_vote-ind">{this.props.likePower}%</div>
				<div className="sub-wrapper_vote-ind">
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
	let post = state.posts[props.index];
	return {
		...props,
		likePower: state.auth.like_power,
		hplTimeout: post.hplTimeout
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
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(VoteIndicator);
