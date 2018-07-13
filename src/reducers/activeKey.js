import storage from "../utils/Storage";

const initialState = {
	activeKey: storage.transferActiveKey || '',
	saveKey: !!storage.transferActiveKey,
};

export default function activeKey(state = initialState, action) {
	switch (action.type) {
		case 'ACTIVE_KEY_CHANGE_VALUE':
			return {
				...state,
				activeKey: action.value
			};
		case 'ACTIVE_KEY_CHANGE_SAVING':
			return {
				...state,
				saveKey: !state.saveKey
			};

		default:
			return state;
	}
}
