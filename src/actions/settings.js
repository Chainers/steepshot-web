import {getStore} from "../store/configureStore";
import {setSubscribeConfigurationAction} from "./oneSignal";
import storage from "../utils/Storage";

export function updateSettings() {
	return dispatch => {
		let settings = getStore().getState().settingsFields;
		storage.settings = settings;
		dispatch(setSubscribeConfigurationAction());
		dispatch({
			type: 'UPDATE_SETTINGS',
			settings
		});
	}
}
