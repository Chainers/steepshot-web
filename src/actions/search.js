export function setSearchValue(value) {
	return {
		type: 'SET_SEARCH_VALUE',
		value
	}
}

export function setSearchPanelState(flag) {
	return {
		type: 'SET_SEARCH_PANEL_STATE',
		flag
	}
}