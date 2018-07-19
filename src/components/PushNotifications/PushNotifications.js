import React from 'react';
import {connect} from 'react-redux';
import './pushNotifications.css';
import PushNotification from './PushNotification';
import {openPushNot} from '../../actions/pushNotification';

class PushNotifications extends React.Component {

	componentWillReceiveProps(nextProps) {

	}

	render() {
		let notifications = [];
		for (let key in this.props.notifications) {
			notifications.push(<PushNotification key={key} index={key}/>);
		}
		return (
			<div className="wrapper_push-not">
				{notifications}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		notifications: state.pushNotifications
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		openPushNot: (index, pushNotBody) => {
			dispatch(openPushNot(index, pushNotBody));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotifications);