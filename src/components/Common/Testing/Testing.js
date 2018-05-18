import React from 'react';
import './testing.css';

class Testing extends React.Component {

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			null
		);
	}
}

export default Testing;
