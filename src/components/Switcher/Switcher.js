import React from "react";
import PropTypes from 'prop-types';
import './switcher.css';

const Switcher = ({onClick, leftLabel = '', rightLabel='', left, leftColor, rightColor}) => (
	<div className="container_switcher">
		<label>{leftLabel}</label>
		<div className="input-container_switcher" onClick={onClick}>
			<div className={left ? 'left_switcher' : 'right_switcher'} style={{color: left ? leftColor : rightColor}}/>
		</div>
		<label>{rightLabel}</label>
	</div>
);

Switcher.propTypes = {
	onClick: PropTypes.func.isRequired,
	leftLabel: PropTypes.string,
	rightLabel: PropTypes.string,
	left: PropTypes.bool.isRequired,
	leftColor: PropTypes.string,
	rightColor: PropTypes.string
};

export default Switcher;