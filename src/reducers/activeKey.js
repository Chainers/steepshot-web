import storage from "../utils/Storage";

const initialState = {
	activeKey: storage.transferActiveKey || '',
	activeKeyError: '',
	saveKey: !!storage.transferActiveKey,
};

export default function activeKey(state = initialState, action) {
	switch (action.type) {
		case 'ACTIVE_KEY_CHANGE_VALUE':
			return {
				...state,
				activeKey: action.value,
				activeKeyError: ''
			};
		case 'TRANSFER_ERROR':
			if (action.activeKeyError) {
				return {
					...state,
					activeKeyError: action.activeKeyError
				};
			}
			return state;
		case 'ACTIVE_KEY_CHANGE_SAVING':
			return {
				...state,
				saveKey: !state.saveKey
			};
		case 'ACTIVE_KEY_CLEAT':
			if (!state.saveKey) {
				return {
					...state,
					activeKey: action.value,
					activeKeyError: ''
				};
			}
			return state;
		default:
			return state;
	}
}
