import React from 'react';
import {updateSettings} from '../../actions/settings';
import {connect} from 'react-redux';
import {goBack} from "react-router-redux";
import './settings.css';
import Constants from "../../common/constants";
import {withWrapper} from "create-react-server/wrapper";
import SettingsField from "./SettingsField/SettingsField";
import {subscribe, unsubscribe} from "../../actions/oneSignal";
import ShowIf from "../Common/ShowIf";
import BodyLoader from "../Common/BlockLoader/BlockLoader";
import storage from "../../utils/Storage";

class Settings extends React.Component {

	constructor(props) {
		super(props);
		if (!storage.settings && !global.isServerSide) {
			props.updateSettings();
		}
	}

	submit() {
		this.props.updateSettings();
		this.props.historyGoBack();
	}

	render() {
		if (global.isServerSide) {
			return null;
		}
		const fields = Constants.SETTINGS.FIELDS;
		return (
			<div className="container_settings">
				<div className="body_settings">
					<div className="block_settings">
						<div className="header_settings">
							<span>SETTINGS</span>
						</div>
						<SettingsField label="Show low rated posts" point={fields.show_low_rated}
													 default={this.props[fields.show_low_rated]}/>
						<SettingsField label="Show NSFW posts" point={fields.show_nsfw}
													 default={this.props[fields.show_nsfw]}/>
					</div>
					<div className="block_settings">
						<div className="header_settings">
							<span>PUSH NOTIFICATIONS</span>
							<ShowIf show={!this.props.notificationEnabled}>
								<button className="subscribe-btn_settings" onClick={this.props.subscribe}>SUBSCRIBE</button>
							</ShowIf>
							<ShowIf show={this.props.notificationEnabled}>
								<button className="unsubscribe-btn_settings" onClick={this.props.unsubscribe}>UNSUBSCRIBE</button>
							</ShowIf>
						</div>
						<div className="blocked-block_settings">
							<BodyLoader show={!this.props.notificationEnabled} withLoader={false}/>
							<SettingsField label="Comment" point={fields.comment}
														 default={this.props[fields.comment]}/>
							<SettingsField label="Upvote" point={fields.upvote}
														 default={this.props[fields.upvote]}/>
							<SettingsField label="Upvote comment" point={fields.upvote_comment}
														 default={this.props[fields.upvote_comment]}/>
							<SettingsField label="Follow" point={fields.follow}
														 default={this.props[fields.follow]}/>
							<SettingsField label="Post" point={fields.post}
														 default={this.props[fields.post]}/>
						</div>
					</div>
				</div>
				<button className="save_settings" onClick={this.submit.bind(this)}>
					Save
				</button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		...state.settings,
		notificationEnabled: state.oneSignal.notificationPermission && state.oneSignal.isNotificationsEnabled,
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
		unsubscribe: () => {
			dispatch(unsubscribe())
		},
		subscribe: () => {
			dispatch(subscribe())
		}
	};
};

export default withWrapper(connect(mapStateToProps, mapDispatchToProps)(Settings));
