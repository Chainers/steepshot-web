import {getStore} from '../store/configureStore';

export function openContextMenu(point) {
	return {
		type: 'OPEN_CONTEXT_MENU',
		point
	}
}

export function closeContextMenu(point) {
	return dispatch => {
		if (!Object.keys(getStore().getState().contextMenu).length) {
			return;
		}
		dispatch({
      type: 'CLOSE_CONTEXT_MENU',
      point
    })
	}
}