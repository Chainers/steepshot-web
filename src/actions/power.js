import {getStore} from "../store/configureStore";
import {actionLock} from "./session";

export function powerUp() {
	let state = getStore().getState();
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
			type: 'POWER_CHANGE_AMOUNT',
			value
		}
	} else {
		return {
			type: 'POWER_CHANGE_ERROR',
			message: 'Incorrect amount.'
		}
	}
}