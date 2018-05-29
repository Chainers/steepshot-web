import RequestService from "../services/requestService";
import Constants from "../common/constants";
import {getStore} from "../store/configureStore";

export function setService(serviceName = Constants.SERVICES.GOLOS.name) {
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