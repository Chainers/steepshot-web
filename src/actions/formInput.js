export function createFormInput(point) {
	return {
		type: 'CREATE_FORM_INPUT',
		point
	}
}

export function focusFormInput(point) {
	return {
		type: 'FOCUS_FORM_INPUT',
		point
	}
}

export function blurFormInput(point) {
	return {
		type: 'BLUR_FORM_INPUT',
		point
	}
}

export function setErrorFormInput(point, message) {
	return {
		type: 'SET_ERROR_FORM_INPUT',
		point,
		message
	}
}

export function changeFormInput(point, value) {
	return {
		type: 'CHANGE_FORM_INPUT',
		point,
		value
	}
}