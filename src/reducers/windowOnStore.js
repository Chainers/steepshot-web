import {utils} from "../utils/utils";
import Constants from "../common/constants";

export default function windowOnStore(state = getActualState(), action) {
	switch (action.type) {
		case 'RESIZE_WINDOW':
			return getActualState();
		default:
			return state;
	}
}

function getActualState() {
	const windowDimension = utils.getWindowDimension();
	return {
		...windowDimension,
		isMobileScreen: windowDimension.width <= Constants.WINDOW.MAX_MOBILE_SCREEN_WIDTH
	}
}