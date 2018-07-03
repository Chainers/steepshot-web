import * as React from 'react';
import {connect} from 'react-redux';
import Footer from '../Footer/Footer';
import Scroll from '../Scroll/Scroll';
import {withWrapper} from 'create-react-server/wrapper';
import './body.css';

const SCROLL_POINT = 'body';

class Body extends React.Component {

	render() {
		const {children} = this.props;

		return (
			<div className={'container_body' + this.props.bodyStyle} key="Main">
				<Scroll point={SCROLL_POINT} className="scroll_body" customScrollStyle="body_scroll" deltaForFetch={1000}>
					<div className={'for-space-between' + this.props.emptyErrorClass}>
						{children}
					</div>
					<Footer/>
				</Scroll>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
  const location = state.router.location || props.location || {};
	const advertisingStatus = state.advertising.advertisingStatus;
	let emptyErrorClass = '';
	if (state.emptyRequestError.point) {
    emptyErrorClass = ` ${state.emptyRequestError.point}-empty-request-error_body`;
	}
	let bodyStyle = !advertisingStatus ? state.window.width < 740
		? ' min-height-160_body' : ' min-height-120_body' : ' min-height-60_body';
	return {
		location,
		bodyStyle,
    emptyErrorClass
	}
};

export default withWrapper(connect(mapStateToProps)(Body));
