import RequestService from "../services/requestService";
import Constants from "../common/constants";

export function setService(serviceName = Constants.SERVICES.GOLOS.name) {
	RequestService.init(serviceName);
	return {
		type: 'SET_SERVICE',
		serviceName
	}
}