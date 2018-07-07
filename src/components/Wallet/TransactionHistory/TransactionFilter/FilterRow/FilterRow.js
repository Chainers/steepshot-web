import React from 'react';
import './filterRow.css';

const FilterRow = ({label, isActive, onClick}) => {
	return (
		<div className={'container_filter-row ' + (isActive ? 'active' : '')}
		     onClick={onClick}
		>
			{label}
			<div className="circle_filter-row"/>
		</div>
	)
};


export default FilterRow;