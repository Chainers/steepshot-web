import React from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import {utils} from '../../utils/utils';
import ReactResizeDetector from 'react-resize-detector';
import {scrollInit, scrollShouldUpdate, setScrollData} from '../../actions/scroll';
import './scroll.css';

const SCROLL_DELTA = 10;

class Scroll extends React.Component {

	constructor(props) {
		super();
		props.scrollInit(props.point);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.shouldUpdate !== this.props.shouldUpdate) {
			this.scroll.scrollTop(this.scroll.getScrollTop());
		}
	}

	onScrollFrame(values) {
		const newPosition = utils.cutNumber(values.top, 1) * 100;
		if (Math.abs(newPosition - this.props.scrollPosition) >= SCROLL_DELTA) {
			this.props.setScrollData(this.props.point, newPosition, values.scrollHeight)
		}
	}

	update() {
		this.scroll.update();
		this.props.scrollShouldUpdate(this.props.point);
	}

	render() {
		const {children, customScrollStyle} = this.props;
		return (
			<Scrollbars onScrollFrame={this.onScrollFrame.bind(this)}
									ref={ref => this.scroll = ref}
									style={this.props.style}
									renderTrackVertical={() => {
										return (<div className={'default_scroll ' + (customScrollStyle || '')}/> )
									}}>
				<div className={this.props.className}>
					{children}
					<ReactResizeDetector handleWidth handleHeight onResize={this.update.bind(this)}/>
				</div>
			</Scrollbars>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		scrollPosition: state.scroll[props.point].position,
		shouldUpdate: state.scroll[props.point].shouldUpdate
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
		setScrollData: (point, position, scrollHeight) => {
			dispatch(setScrollData(point, position, scrollHeight))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Scroll);
