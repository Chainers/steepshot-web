import React from 'react';
import './actionRow.css';

const ActionRow = ({label, icon, isActive, onClick}) => {
	return (
		<div className='container_action-row'
		     onClick={onClick}
		>
			{label}
			<div className="icon_action-row" style={{
				background: `url(${icon}) no-repeat center`,
				backgroundSize: 'contain'
			}}/>
		</div>
	)
};

export default ActionRow;