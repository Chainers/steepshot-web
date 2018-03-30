import React from 'react';
import './testing.css';

class Testing extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<div className="test">
				test23
			</div>
		);
	}
}

export default Testing;
