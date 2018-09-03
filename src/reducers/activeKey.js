import storage from '../utils/Storage';

const initialState = {
	activeKey: storage.activeKey || '',
	saveKey: false,
	showActiveKey: false
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

    case 'SET_ACTIVE_KEY_INPUT_SECURITY':
      return {
        ...state,
        showActiveKey: action.state
      };

		case 'CLOSE_MODAL':
			if (action.index === 'Transfer' || action.index === 'PowerUp' || action.index === 'PowerDown'
				|| action.index === 'SendBid') {
				if (!state.saveKey) {
					return {
						...state,
						activeKey: action.value,
						activeKeyError: ''
					};
				}
			}
			return state;

		default:
			return state;
	}
}
