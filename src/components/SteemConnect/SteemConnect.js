import {connect} from 'react-redux'
import {utils} from "../../utils/utils";
import {loginWithSteemConnect} from "../../actions/login";

const SteemConnect = ({location, loginWithSteemConnect}) => {
	loginWithSteemConnect(utils.urlParamsToObject(location.search));
	return null;
};

const mapDispatchToProps = (dispatch) => {
	return {
		loginWithSteemConnect: params => {
			dispatch(loginWithSteemConnect(params))
		}
	}
};

export default connect(() => {}, mapDispatchToProps)(SteemConnect);