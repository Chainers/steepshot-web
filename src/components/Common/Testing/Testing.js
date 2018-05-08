import React from 'react';
import './testing.css';
import MobileNavigation from "../../MobileNavigation/MobileNavigation";

class Testing extends React.Component {

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<MobileNavigation/>
		);
	}
}

export default Testing;
