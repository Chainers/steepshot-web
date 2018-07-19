import React from 'react';
import {connect} from 'react-redux';
import {setAdvertisingStatus} from '../../actions/advertising';
import './advertising.css';

class Advertising extends React.Component {

	setAdvertisingStatus(status) {
		this.props.setAdvertisingStatus(status);
		this.container.classList.add('closed_advertising');
	}

	componentDidMount() {
		if (!this.props.advertisingStatus) {
			this.container.classList.remove('closed_advertising')
		}
	}

	render() {
		return (
			<div key="Advertising" className="block-in-body_advertising closed_advertising" ref={ref => this.container = ref}>
				<div className="wrapper_advertising centered--flex">
					<div className="sub-wrapper_advertising">
						<div className="text-wrapper_advertising">
							<p>Steepshot is looking for a Seed stage investment. If you’re interested, please contact us for more
								details at pc@steepshot.io</p>
						</div>
						<div className="close-wrapper_advertising centered--flex"
						     onClick={this.setAdvertisingStatus.bind(this, true)}>
							<div className="close_advertising"/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		advertisingStatus: state.advertising.advertisingStatus
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setAdvertisingStatus: (status) => {
			dispatch(setAdvertisingStatus(status));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Advertising);