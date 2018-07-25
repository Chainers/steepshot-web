import React from 'react';
import {connect} from 'react-redux';
import {Scrollbars} from 'react-custom-scrollbars';
import ReactResizeDetector from 'react-resize-detector';
import {shouldFetch} from '../../actions/scroll';
import './scroll.css';

class Scroll extends React.Component {

	onScrollFrame(values) {
		const {point, deltaForFetch} = this.props;
		if (values.scrollHeight - values.scrollTop < deltaForFetch) {
			this.props.shouldFetchFunc(point);
		}
	}

	update() {
		this.forceUpdate();
	}

	static hideHorizontalThumb() {
		return <div className="hide"/>
	}

	render() {
		const {children, customScrollStyle} = this.props;
		return (
			<Scrollbars onScrollFrame={this.onScrollFrame.bind(this)}
			            style={this.props.style}
									renderThumbHorizontal={Scroll.hideHorizontalThumb}
			            renderTrackVertical={() => {
				            return (<div className={'default_scroll ' + (customScrollStyle || '')}/>)
			            }}>
				<div className={this.props.className}>
					{children}
					<ReactResizeDetector handleHeight onResize={this.update.bind(this)}/>
				</div>
			</Scrollbars>
		);
	}
}

Scroll.defaultProps = {
	deltaForFetch: 0
};

const mapStateToProps = () => {
	return {}
};

const mapDispatchToProps = (dispatch) => {
	return {
		shouldFetchFunc: (point) => {
			dispatch(shouldFetch(point))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Scroll);
