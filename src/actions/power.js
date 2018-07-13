export function powerUp() {
	
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