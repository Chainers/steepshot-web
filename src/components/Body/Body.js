import React from 'react';
import {connect} from 'react-redux';
import Footer from "../Footer/Footer";
import {Scrollbars} from "react-custom-scrollbars";
import {utils} from "../../utils/utils";
import ReactResizeDetector from 'react-resize-detector';
import {scrollInit, scrollShouldUpdate, setScrollData} from "../../actions/scroll";
import './body.css';

const SCROLL_DELTA = 10;
const STORE_POINT = 'body';

class Body extends React.Component {

	constructor(props) {
		super();
		props.scrollInit(STORE_POINT);
	}

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
			this.props.setScrollData('body', newPosition, values.scrollTop, values.scrollHeight)
		}
	}

	update() {
		this.scroll.update();
		this.props.scrollShouldUpdate(STORE_POINT);
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
		scrollPosition: state.scroll[STORE_POINT].position,
		shouldUpdate: state.scroll[STORE_POINT].shouldUpdate,
		scrollTop: state.scroll[STORE_POINT].scrollTop,
		pathname: location.pathname
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		scrollInit: point => {
			dispatch(scrollInit(point))
		},
		scrollShouldUpdate: point => {
			dispatch(scrollShouldUpdate(point))
		},
		setScrollData: (point, position, scrollTop, scrollHeight) => {
			dispatch(setScrollData(point, position, scrollTop, scrollHeight))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Body);
