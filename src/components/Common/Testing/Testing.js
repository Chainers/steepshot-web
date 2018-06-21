import React from 'react';
import './testing.css';
import Wallet from "../Wallet/Wallet";

class Testing extends React.Component {

	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<Wallet />
		);
	}
}

export default Testing;
