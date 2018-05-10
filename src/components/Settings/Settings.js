import React from 'react';
import {setOldSettings, toggleLowRated, toggleNsfw, updateSettings} from '../../actions/settings';
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

	componentWillUnmount() {
		this.props.setOldSettings();

	}

	submit(e) {
		e.preventDefault();
		this.props.updateSettings(this.props.lowRated, this.props.nsfw);
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
					<SettingsField label="Show low rated posts" active={this.props.lowRated} onClick={this.props.toggleLowRated}/>
					<SettingsField label="Show NSFW posts" active={this.props.nsfw} onClick={this.props.toggleNsfw}/>
					<div className="notification_settings">
						<span>Push Notification</span>
						<ShowIf show={!this.props.notificationEnabled}>
							<button onClick={registerForPushNotifications}>Subscribe</button>
						</ShowIf>
						<ShowIf show={this.props.notificationEnabled}>
							<SettingsField label="Post" active={this.props.lowRated} onClick={this.props.toggleLowRated}/>
							<SettingsField label="Upvote" active={this.props.nsfw} onClick={this.props.toggleNsfw}/>
							<SettingsField label="Comment" active={this.props.lowRated} onClick={this.props.toggleLowRated}/>
							<SettingsField label="Upvote comment" active={this.props.nsfw} onClick={this.props.toggleNsfw}/>
							<SettingsField label="follow" active={this.props.lowRated} onClick={this.props.toggleLowRated}/>
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
		lowRated: state.settings.lowRatedBtn,
		nsfw: state.settings.nsfwBth,
		notificationEnabled: state.oneSignal.notificationPermission && state.oneSignal.isNotificationsEnabled
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateSettings: (lowRated, nsfw) => {
			dispatch(updateSettings(lowRated, nsfw));
		},
		historyGoBack: () => {
			dispatch(goBack());
		},
		pushMessage: (message) => {
			dispatch(pushMessage(message))
		},
		toggleLowRated: () => {
			dispatch(toggleLowRated())
		},
		toggleNsfw: () => {
			dispatch(toggleNsfw())
		},
		setOldSettings: () => {
			dispatch(setOldSettings())
		}
	};
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Settings));
