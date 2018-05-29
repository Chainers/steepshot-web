export function setUsernameErrorMessage(message = '') {
	return {
		type: 'SET_USERNAME_ERROR_MESSAGE',
		message
	}
}

export function setPostingKeyErrorMessage(message = '') {
	return {
		type: 'SET_POSTING_KEY_ERROR_MESSAGE',
		message
	}
}

export function clearLoginErrors() {
	return {
		type: 'CLEAR_LOGIN_ERROR'
	}
}