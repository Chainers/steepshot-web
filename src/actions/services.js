import RequestService from "../services/requestService";
import Constants from "../common/constants";
import {getStore} from "../store/configureStore";
import storage from "../utils/Storage";

export function setService(serviceName = storage.service || Constants.SERVICES.STEEM.name) {
	RequestService.init(serviceName);
	return {
		type: 'SET_SERVICE',
		serviceName
	}
}

export function switchService() {
	const serviceName = getStore().getState().services.name;
	return dispatch => {
		if (serviceName === Constants.SERVICES.STEEM.name) {
			dispatch(setService(Constants.SERVICES.GOLOS.name));
		} else {
			dispatch(setService(Constants.SERVICES.STEEM.name));
		}
	}
}