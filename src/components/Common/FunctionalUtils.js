import React from 'react';
import {connect} from 'react-redux';
import {updateVotingPower} from '../../actions/auth';
import PushMessage from "./PushMessage/PushMessage";
import PushNotifications from "../PushNotifications/PushNotifications";
import Clipboard from "./Clipboard/Clipboard";
import Modals from "../Modals/Modals";
import {resizeWindow} from "../../actions/utilsActions";

class FunctionalUtils extends React.Component {

  componentDidMount() {
		window.addEventListener('resize', this.props.resizeWindow);
    this.updateVotingPower();
  }

	componentWillUnmount() {
		window.removeEventListener('resize', this.props.resizeWindow);
	}

  updateVotingPower() {
    if (this.props.user) {
      this.props.updateVotingPower(this.props.user);
    }
  }

  render() {
    return (
      <div className="utils-container">
				<PushNotifications/>
        <PushMessage />
				<Clipboard/>
				<Modals/>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    user: state.auth.user
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateVotingPower: (username) => {
      dispatch(updateVotingPower(username));
    },
		resizeWindow: (width, height) => {
    	dispatch(resizeWindow(width, height))
		}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionalUtils);