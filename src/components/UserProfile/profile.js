import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { 
  getUserProfile
} from '../../actions/profile';
import { connect } from 'react-redux';
import FollowersComponent from './followersComponent';
import FollowingComponent from './followingComponent';
import FollowComponent from '../Posts/FollowComponent';
import ItemsComponent from './itemsComponent';
import constants from '../../common/constants';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.username,
      profile: null,
      localize: LocalizedStrings.getInstance(),
      showFollow: this.props.showFollow != undefined ? this.props.showFollow  : true,
      user: this.props.user || null
    };
  }

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile(userName) {
    let _this = this;
    let showFollow = true;

    userName = userName || this.props.username;

    getUserProfile(userName, this.state.user).then((result) => {
      const profile = result;

      if (!this.props.username || profile.current_username === this.props.username) {
        showFollow = false;
      }

      _this.setState({
        showFollow: showFollow,
        profile: profile,
        avatar: profile.profile_image
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username === this.state.authorName) {
        return;
    }

    this.setState({
        authorName: nextProps.username,
        profile: null
    });

    this.getUserProfile(nextProps.username);
  }

  setDefaultAvatar() {
    this.setState({ avatar: constants.NO_AVATAR });
  }

  render() {
    let profileImageSrc = this.state.avatar || constants.NO_AVATAR;
    let name = '';
    let website = '';
    let about = '';
    let location = '';
    let balance = 0;
    let postsCount = 0;
    let followersCount = 0;
    let followingCount = 0;

    if (this.state.profile) {
      name = this.state.profile.name;
      website = this.state.profile.website;
      about = this.state.profile.about;
      location = this.state.profile.location;
      balance = this.state.profile.estimated_balance;
      postsCount = this.state.profile.post_count;
      followersCount = this.state.profile.followers_count;
      followingCount = this.state.profile.following_count;
    }

    return (
      <div className="g-main_i container">
        <div className="g-content col-xs-12 clearfix" id="workspace">
          <div className="row">
            <div className="col-xs-12 col-md-4 col-lg-3">
              <div className="user-information">
                <div className="pic-wrap clearfix">
                  <div className="pic">
                    <img src={profileImageSrc} 
                      alt="" 
                      onError={this.setDefaultAvatar.bind(this)}/>
                  </div>
                  { this.state.showFollow ? <FollowComponent item={this.state.profile} /> : null }
                </div>
                <div className="name">{name}</div>
                <div className="location">{location}</div>
                <p>{about}</p>
                <p>
                  <a href={website}>{website}</a>
                </p>
                <div className="amount">
                  <div className="count">$ {balance}</div>
                  <div className="description">This is the current amount of funds in your account in the application.</div>
                </div>
              </div>
            </div>
            <div className="col-xs-12 col-md-8 col-lg-9">
              <div className="user-tabs">
                <ul role="tablist" className="nav nav-tabs list-reset">
                  <li role="presentation" className="active">
                    <a href="#tab-profile-1" aria-controls="tab-profile-1" role="tab" data-toggle="tab" className="tab-head">
                      {postsCount} Posts
                    </a>
                  </li>
                  <li role="presentation">
                    <a href="#tab-profile-2" aria-controls="tab-profile-2" role="tab" data-toggle="tab" className="tab-head">
                      {followingCount} Following
                    </a>
                  </li>
                  <li role="presentation">
                    <a href="#tab-profile-3" aria-controls="tab-profile-3" role="tab" data-toggle="tab" className="tab-head">
                      {followersCount} Followers
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="tab-profile-1" role="tabpanel" className="tab-pane fade in active">
                    <ItemsComponent username={this.state.authorName} currentUser={this.state.user}/>
                  </div>
                  <div id="tab-profile-2" role="tabpanel" className="tab-pane fade">
                    <FollowingComponent username={this.state.authorName} currentUser={this.state.user}/>
                  </div>
                  <div id="tab-profile-3" role="tabpanel" className="tab-pane fade">
                    <FollowersComponent username={this.state.authorName} currentUser={this.state.user}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(UserProfile);
