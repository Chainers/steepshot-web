import React from 'react';
import {connect} from 'react-redux';
import {closeModal, setModalOptions} from '../../../actions/modal';
import ReactResizeDetector from 'react-resize-detector';
import ShowIf from '../../Common/ShowIf';
import './modal.css';

const mobileSize = document.documentElement.clientWidth < 815;

class Modal extends React.Component {

	constructor(props) {
		super(props);
		this.resizeWindow = this.resizeWindow.bind(this);
	}

	componentDidMount() {
		window.addEventListener('resize', this.resizeWindow);
		this.resizeWindow();
		this.container.classList.remove('before-load-back_modal');
		this.body.classList.remove('before-load_modal');
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeWindow);
	}

	shouldComponentUpdate(nextProps) {
		if (nextProps.willClose) {
			this.body.classList.add('before-load_modal');
			this.container.classList.add('before-load-back_modal');
		}
		return true;
	}

	resizeWindow() {
		if (!this.body || !this.container) {
			return;
		}
		if (this.props.bodyHeight !== this.body.clientHeight || this.props.containerHeight !== this.container.clientHeight) {
			this.props.setModalOptions(this.props.index, {
				bodyHeight: this.body.clientHeight,
				containerHeight: this.container.clientHeight
			});
		}
	}

	clickOutside(event) {
		event.stopPropagation();
		if (this.body && !this.body.contains(event.target) && !this.props.fullScreenMode) {
			this.props.closeModal(this.props.index);
		}
	}

	render() {
		let styleBack = {backgroundColor: 'rgba(0, 0, 0, .7)'}, crossFullScreen = null;
		if (this.props.fullScreenMode) {
			styleBack = {backgroundColor: '#000000'};
			crossFullScreen = <div className="cross-wrapper_modal"
														 onClick={() => {
															 this.props.closeModal(this.props.index)
														 }}
			>
				<div className="cross-full-screen_modal"/>
			</div>;
		}
		styleBack.alignItems = this.props.bodyHeight >= this.props.containerHeight ? 'flex-start' : 'center';
		styleBack.zIndex = 1005;
		return (
			<div className="back_mods before-load-back_modal ov-scroll_modal"
					 onClick={this.clickOutside.bind(this)}
					 style={styleBack}
					 ref={ref => {
						 this.container = ref
					 }}
			>
				{crossFullScreen}
				<div className="body_modal before-load_modal"
						 ref={ref => {
							 this.body = ref
						 }}
				>
					{this.props.body}
				</div>
				<ShowIf show={!mobileSize}>
					<ReactResizeDetector handleWidth handleHeight onResize={this.resizeWindow}/>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		...state.modals[props.index],
		state: state,
		fullScreenMode: state.postModal.fullScreenMode
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		closeModal: (index) => {
			dispatch(closeModal(index));
		},
		setModalOptions: (index, options) => {
			dispatch(setModalOptions(index, options))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
