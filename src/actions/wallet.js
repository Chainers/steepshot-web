import {getStore} from "../store/configureStore";
import {actionLock, actionUnlock} from "./session";
import WalletService from "../services/WalletService";
import storage from "../utils/Storage";

export function powerUp() {
	let state = getStore().getState();
	return dispatch => {
		if (state.session.actionLocked) {
			return {
				type: 'ACTION_LOCKED_POWER_UP'
			}
		}
		dispatch(actionLock());
		const {amount} = state.power;
		const {total_steem_power_steem, total_steem_power_vests} = state.userProfile.profile;
		const amountVests = (amount / total_steem_power_steem) * total_steem_power_vests;
		const {activeKey, saveKey} = state.activeKey;
		if (saveKey) {
			storage.transferActiveKey = activeKey;
		} else {
			storage.transferActiveKey = null;
		}
		WalletService.powerUp(activeKey, amountVests)
			.then(response => {
				dispatch(actionUnlock());
			})
			.catch(error => {
				dispatch(actionUnlock());
			})
	}
}

export function powerDown() {

}

export function changeAmount(value) {
	const validCharacters = /^[0-9.]*$/;
	if (validCharacters.test(value)) {
		return {
			type: 'WALLET_CHANGE_AMOUNT',
			value
		}
	} else {
		return {
			type: 'WALLET_CHANGE_ERROR',
			message: 'Incorrect amount.'
		}
	}
}

export function setToken(value) {
	return {
		type: 'WALLET_SET_TOKEN',
		value
	}
}