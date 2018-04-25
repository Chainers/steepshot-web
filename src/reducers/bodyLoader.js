export default function bodyLoader(state = false, action) {
	switch (action.type) {
		case 'SHOW_BODY_LOADER':
			return true;
		case 'HIDE_BODY_LOADER':
			return false;
		default:
			return state;
	}
}
