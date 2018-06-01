import React from 'react';
import {connect} from 'react-redux';
import BodyLoader from "../Common/BlockLoader/BlockLoader";
import Footer from "../Footer/Footer";
import {Scrollbars} from "react-custom-scrollbars";
import './body.css';
import {scrollingBody} from "../../actions/body";
import {utils} from "../../utils/utils";

const SCROLL_DELTA = 10;

class Body extends React.Component {

	onScrollFrame(values) {
		const newPosition = utils.cutNumber(values.top, 1) * 100;
		if (Math.abs(newPosition - this.props.scrollPosition) >= SCROLL_DELTA) {
			this.props.scrollingBody(newPosition)
		}
	}

	render() {
		const {children} = this.props;
		return (
			<div className="container_body" key="Main">
				<Scrollbars onScrollFrame={this.onScrollFrame.bind(this)}>
					<div className="for-space-between">
						{children}
						<BodyLoader/>
					</div>
					<Footer/>
				</Scrollbars>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		scrollPosition: state.body.position
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		scrollingBody: (position) => {
			dispatch(scrollingBody(position))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
