import React from 'react';
import './testing.css';
import Settings from "../../Settings/Settings";

class Testing extends React.Component {

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<Settings />
		);
	}
}

export default Testing;
