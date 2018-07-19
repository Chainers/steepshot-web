import React from "react";
import {connect} from 'react-redux'
import Utils from "../../utils/Utils";
import {loginWithSteemConnect} from "../../actions/login";

class SteemConnect extends React.Component {
	constructor(props) {
		super();
		props.loginWithSteemConnect(Utils.urlParamsToObject(props.location.search));
	}

	render() {
		return null;
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		loginWithSteemConnect: params => {
			dispatch(loginWithSteemConnect(params))
		}
	}
};

export default connect(() => {
}, mapDispatchToProps)(SteemConnect);