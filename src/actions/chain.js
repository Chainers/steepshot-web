import ChainService from "../services/chainService";
import SteemService from "../services/steemService";

export function initChain() {
	ChainService.initConfig(SteemService);
	return {
		type: 'INIT_CHAIN',
		service: SteemService
	}
}

export function setServie(service) {
	ChainService.setService(service);
	return {
		type: 'SET_CHAIN_SERVICE',
		service
	}
}