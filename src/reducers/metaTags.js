const initialState = [];

export default function metaTags(state = initialState, action) {
	switch (action.type) {
		case 'ADD_META_TAGS':
			return [...state, ...action.tags];
		default:
			return state;
	}
}
