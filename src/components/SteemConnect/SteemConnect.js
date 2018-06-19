import React from "react";
import {connect} from 'react-redux'
import {utils} from "../../utils/utils";
import {loginWithSteemConnect} from "../../actions/login";

class SteemConnect extends React.Component {
	constructor(props) {
		super();
		props.loginWithSteemConnect(utils.urlParamsToObject(props.location.search));
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

export default connect(() => {}, mapDispatchToProps)(SteemConnect);