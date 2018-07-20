export function setActiveKeyInputSecurity(state) {
  return {
    type: 'SET_ACTIVE_KEY_INPUT_SECURITY',
    state: !state
  }
}

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