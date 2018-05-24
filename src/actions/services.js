import RequestService from "../services/requestService";
import Constants from "../common/constants";

export function setService(serviceName = Constants.SERVICES.STEEM.name) {
	RequestService.init(serviceName);
	return {
		type: 'SET_SERVICE',
		serviceName
	}
}