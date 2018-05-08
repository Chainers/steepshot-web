import React from 'react';
import PropTypes from 'prop-types';
import './settingsField.css';

const SettingsField = ({label, active, onClick}) => (
	<div className="field_settings">
		<span>{label}</span>
		<div className={'check-box_settings' + (active ? ' active' : '')}
				 onClick={onClick}>
			<div className="checked_settings"/>
		</div>
	</div>
);

SettingsField.propTypes = {
	label: PropTypes.string.isRequired,
	active: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired
};

export default SettingsField;
