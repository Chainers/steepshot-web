import React from 'react';
import PropTypes from 'prop-types';
import { connect, store } from 'react-redux';
import { getUserProfile } from '../../actions/profile';

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profile: {},
            avatar: null
        };
    }

    componentDidMount() {
        this.loadUserProfile();
    }

    loadUserProfile() {
        let _this = this;

        getUserProfile(this.props.user).then((response) => {
            _this.setState({ 
                profile: response,
                avatar: response.profile_image
            });
            console.log(response);
        });
    }

    setDefaultAvatar() {
        this.setState({ avatar: '/src/images/person.png' });
    }

    render() {
        let profileImageSrc = this.state.avatar || "/src/images/person.png";

        return (
            <div className='user-profile'>
                <br/>
                <img className="user-big-avatar" src={profileImageSrc} alt="Image" onError={this.setDefaultAvatar.bind(this)}/>
                <div className='profile-info'>
                    <div>
                        <h3>{this.state.profile.username}</h3>
                    </div>
                    <div>
                        <span><strong>{this.state.profile.post_count}</strong> posts</span>
                        <span><strong>{this.state.profile.followers_count}</strong> followers</span>
                        <span><strong>{this.state.profile.following_count}</strong> following</span>
                    </div>
                    <div>
                        <span><strong>{this.state.profile.name}</strong> {this.state.profile.about} <a
                        href={this.state.profile.website}>{this.state.profile.website}</a></span>
                    </div>
                </div>
                <br/>
            </div>
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

export default connect(mapStateToProps)(Account);