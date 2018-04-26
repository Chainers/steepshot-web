import React from 'react';
import './testing.css';
import Login from "../../Login/Login";

class Testing extends React.Component {

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<Login />
		);
	}
}

export default Testing;
