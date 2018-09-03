import {getStore} from '../store/configureStore';

export function openContextMenu(point) {
	const isMenuAlreadyOpened = getStore().getState().contextMenu[point];
	if (isMenuAlreadyOpened) {
    return {
      type: 'CLOSE_CONTEXT_MENU',
      point
    }
  }
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