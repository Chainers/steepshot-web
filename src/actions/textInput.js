export function initTextInput(point, state) {
	return {
		type: 'INIT_TEXT_INPUT',
		point,
		state
	}
}

export function setTextInputState(point, state) {
	return {
		type: 'TEXT_INPUT_SET_STATE',
		point,
		state
	}
}

export function setTextInputError(point, message) {
	return {
		type: 'TEXT_INPUT_SET_ERROR',
		point,
		message
	}
}

export function clearTextInputState(point) {
	return setTextInputState(point, {focusedStyle: '', text: '', error: ''});
}

export function focusedTextInput(point) {
	return {
		type: 'FOCUSED_TEXT_INPUT',
		point
	}
}

export function blurredTextInput(point) {
	return {
		type: 'BLURRED_TEXT_INPUT',
		point
	}
}
