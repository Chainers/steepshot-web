import React from 'react';
import {connect} from 'react-redux';
import UserProfile from '../UserProfile/profile';

class Profile extends React.Component {
	render() {
		if (global.isServerSide) {
			return null;
		}
		return (
			<UserProfile username={this.props.user} showFollow={false}/>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps)(Profile);
