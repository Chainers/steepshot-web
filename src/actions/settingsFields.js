export function initializeSettingsField(point, def) {
	return {
		type: 'INITIALIZE_SETTINGS_FIELD',
		default: def,
		point
	}
}

export function toggleSettingsField(point) {
	return {
		type: 'TOGGLE_SETTINGS_FIELD',
		point
	}
}
