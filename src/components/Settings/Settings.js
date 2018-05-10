import React from 'react';
import {updateSettings} from '../../actions/settings';
import {connect} from 'react-redux';
import {goBack} from "react-router-redux";
import {pushMessage} from "../../actions/pushMessage";
import './settings.css';
import Constants from "../../common/constants";
import {withWrapper} from "create-react-server/wrapper";
import SettingsField from "./SettingsField/SettingsField";
import {registerForPushNotifications} from "../../actions/oneSignal";
import ShowIf from "../Common/ShowIf";

class Settings extends React.Component {

	submit(e) {
		e.preventDefault();
		this.props.updateSettings();
		this.props.historyGoBack();
		this.props.pushMessage(Constants.SETTINGS_CHANGED_MESSAGE);
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="container_settings">
				<div className="header_settings">
					<span>SETTINGS</span>
				</div>
				<div className="body_settings">
					<SettingsField label="Show low rated posts" point={Constants.SETTINGS.FIELDS.show_low_rated}
												 default={this.props[Constants.SETTINGS.FIELDS.show_low_rated]}/>
					<SettingsField label="Show NSFW posts" point={Constants.SETTINGS.FIELDS.show_nsfw}
												 default={this.props[Constants.SETTINGS.FIELDS.show_nsfw]}/>
					<div className="notification_settings">
						<span>Push Notification</span>
						<ShowIf show={!this.props.notificationEnabled}>
							<button onClick={registerForPushNotifications}>Subscribe</button>
						</ShowIf>

					</div>
					<button className="save_settings" onClick={this.submit.bind(this)}>Save</button>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state.settings,
		notificationEnabled: state.oneSignal.notificationPermission && state.oneSignal.isNotificationsEnabled
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateSettings: () => {
			dispatch(updateSettings());
		},
		historyGoBack: () => {
			dispatch(goBack());
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		}
	};
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Settings));
