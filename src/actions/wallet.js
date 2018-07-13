import {getStore} from "../store/configureStore";
import {actionLock} from "./session";

export function powerUp() {
	let state = getStore().getState();
	const {amount} = state.power;
	const {total_steem_power_steem, total_steem_power_vests} = state.userProfile.profile;
	const amountVests = (amount / total_steem_power_steem) * total_steem_power_vests;
	console.log(amountVests);
	return dispatch => {
		if (state.session.actionLocked) {
			return;
		}
		dispatch(actionLock());
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