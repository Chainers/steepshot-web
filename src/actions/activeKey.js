export function changeActiveKey(value) {
	return {
		type: 'ACTIVE_KEY_CHANGE_VALUE',
		value
	}
}

export function changeSavingKey() {
	return {
		type: 'ACTIVE_KEY_CHANGE_SAVING'
	}
}

export function clearActiveKey() {
	return {
		type: 'ACTIVE_KEY_CLEAT'
	}
}