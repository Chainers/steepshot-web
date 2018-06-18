import * as React from 'react';
import {connect} from 'react-redux';
import Footer from '../Footer/Footer';
import Scroll from '../Scroll/Scroll';
import './body.css';

const SCROLL_POINT = 'body';

class Body extends React.Component {

	render() {
		const {children} = this.props;
		return (
			<div className={'container_body' + this.props.bodyStyle} key="Main">
				<Scroll point={SCROLL_POINT} className="scroll_body">
					<div className="for-space-between">
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
	let bodyStyle = !advertisingStatus ? state.window.width < 740
		? ' min-height-160_body' : ' min-height-120_body' : ' min-height-60_body';
	return {
		location,
		bodyStyle
	}
};

export default connect(mapStateToProps)(Body);
