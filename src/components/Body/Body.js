import React from 'react';
import {connect} from 'react-redux';
import Footer from "../Footer/Footer";
import {Scrollbars} from "react-custom-scrollbars";
import './body.css';
import {scrollingBody} from "../../actions/body";
import {utils} from "../../utils/utils";
import ReactResizeDetector from 'react-resize-detector';

const SCROLL_DELTA = 10;

class Body extends React.Component {

	shouldComponentUpdate(nextProps) {
		return !utils.equalsObjects(this.props, nextProps, 2)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.shouldUpdate !== this.props.shouldUpdate) {
			this.scroll.scrollTop(nextProps.scrollTop + 1);
		}
	}

	onScrollFrame(values) {
		const newPosition = utils.cutNumber(values.top, 1) * 100;
		if (Math.abs(newPosition - this.props.scrollPosition) >= SCROLL_DELTA) {
			this.props.scrollingBody(newPosition, values.scrollTop, values.scrollHeight)
		}
	}

	update() {
		this.scroll.update();
	}

	render() {
		const {children} = this.props;
		return (
			<div className="container_body" key="Main">
				<Scrollbars onScrollFrame={this.onScrollFrame.bind(this)} ref={ref => this.scroll = ref}>
					<div className="for-space-between" ref={ref => this.content = ref}>
						{children}
						<ReactResizeDetector handleWidth handleHeight onResize={this.update.bind(this)} />
					</div>
					<Footer/>
				</Scrollbars>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const location = state.router.location || props.location || {};
	return {
		scrollPosition: state.body.position,
		shouldUpdate: state.body.shouldUpdate,
		scrollTop: state.body.scrollTop,
		pathname: location.pathname
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		scrollingBody: (position, scrollTop, scrollHeight) => {
			dispatch(scrollingBody(position, scrollTop, scrollHeight))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
