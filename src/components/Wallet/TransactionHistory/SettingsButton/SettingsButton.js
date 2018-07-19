import React from 'react';
import './settingsButton.css';

const SettingsButton = ({onClick, active = false}) => {
	return (
		<div className={'container_settings-button ' + (active ? 'active_settings-button' : '')} onClick={onClick}/>
	)
};

export default SettingsButton;