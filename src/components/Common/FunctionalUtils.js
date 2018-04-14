import React from 'react';
import {connect} from 'react-redux';
import {updateVotingPower} from '../../actions/auth';

class FunctionalUtils extends React.Component {

  componentDidMount() {
    this.updateVotingPower();
  }

  updateVotingPower() {
    if (this.props.user) {
      this.props.updateVotingPower(this.props.user);
    }
  }

  render() {
    return null;
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
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(FunctionalUtils);