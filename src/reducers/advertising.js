import storage from '../utils/Storage';

const initialState = {
	advertisingStatus: !!storage.searchInvestorsStatus
};
export default function advertising(state = initialState, action) {
	switch (action.type) {
		case 'SET_ADVERTISING_STATUS':
			return {
				...state,
				advertisingStatus: action.status
			};
		default:
			return state;
	}
}
