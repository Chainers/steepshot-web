import {utils} from "../utils/utils";

export default function windowOnStore(state = utils.getWindowDimension(), action) {
	switch (action.type) {
		case 'RESIZE_WINDOW':
			return {
				...state,
				...utils.getWindowDimension()
			};
		default:
			return state;
	}
}
