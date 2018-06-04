const initialState = {};

export default function textInput(state = initialState, action) {
	switch (action.type) {
		case 'INIT_TEXT_INPUT':
			return {
				...state,
				[action.point]: {...action.state}
			};
		case 'TEXT_INPUT_SET_STATE':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					...action.state
				}
			};
		case 'TEXT_INPUT_SET_ERROR':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					error: action.message
				}
			};
		case 'FOCUSED_TEXT_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					focused: true
				}
			};
		case 'BLURRED_TEXT_INPUT':
			return {
				...state,
				[action.point]: {
					...state[action.point],
					focused: false
				}
			};
		case 'SET_FOCUS_TEXT_INPUT':
			return {
        ...state,
        [action.point]: {
          ...state[action.point],
          setFocus: action.isFocused
        }
			};

		default:
			return state;
	}
}
