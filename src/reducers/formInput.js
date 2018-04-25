export default function formInput(state = {}, action) {
	switch (action.type) {
		case 'CREATE_FORM_INPUT':
			return {
				...state,
				[action.point]: {
					errorMsg: '',
					focused: false
				}
			};
		case 'FOCUS_FORM_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					focused: true,
					errorMsg: ''
				}
			};
		case 'BLUR_FORM_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					focused: false
				}
			};
		case 'SET_ERROR_FORM_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					errorMsg: action.message
				}
			};
		case 'CHANGE_FORM_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					value: action.value
				}
			};
		default:
			return state;
	}
}
