import React from 'react';
import {
    connect
} from 'react-redux';
import UserProfile from '../UserProfile/profile';

class Profile extends React.Component {
    render() {
        return(
            <UserProfile username={this.props.user} showFollow={false} />
        );
    }
}

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization,
    search: state.search,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Profile);