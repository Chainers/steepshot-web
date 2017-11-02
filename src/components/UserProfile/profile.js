import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { 
  getUserProfile
} from '../../actions/profile';
import {
  getFollowers,
  getFollowing
} from '../../actions/posts';
import { connect } from 'react-redux';
import UsersComponent from './UsersComponent';
import FollowComponent from '../Posts/FollowComponent';
import ItemsComponent from './itemsComponent';
import Constants from '../../common/constants';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      watcher : this.props.user,
      authorName : this.props.username,
      profile : null,
      localize : LocalizedStrings.getInstance(),
      showFollow : this.props.showFollow != undefined ? this.props.showFollow  : true,
      itemsPoint : this.insertUsername(Constants.POSTS_FILTERS.POSTS_USER.point, this.props.username),
      followingPoint : this.insertUsername(Constants.USERS_FILTERS.FOLLOWING.point, this.props.username),
      followersPoint : this.insertUsername(Constants.USERS_FILTERS.FOLLOWERS.point, this.props.username)
    };
  }

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile(userName) {
    let showFollow = true;
    userName = userName || this.state.authorName;
    getUserProfile(userName).then((result) => {
      if (this.state.watcher == userName || this.state.watcher == undefined) {
        showFollow = false;
      }
      this.setState({
        showFollow: showFollow,
        profile: result,
        avatar: result.profile_image
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username === this.state.authorName) {
        return;
    }
    this.setState({
        avatar : Constants.NO_AVATAR,
        authorName: nextProps.username,
        itemsPoint : this.insertUsername(Constants.POSTS_FILTERS.POSTS_USER.point, nextProps.username),
        followingPoint : this.insertUsername(Constants.USERS_FILTERS.FOLLOWING.point, nextProps.username),
        followersPoint : this.insertUsername(Constants.USERS_FILTERS.FOLLOWERS.point, nextProps.username)
    });

    this.getUserProfile(nextProps.username);
  }

  insertUsername(point, userName) {
      if (userName == undefined) return point;
      let path = point.split('/');
      return `${path[0]}/${userName}/${path[1]}`;
  }

  render() {
    let profileImageSrc = this.state.avatar || Constants.NO_AVATAR;
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
                    <img src={profileImageSrc} />
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
            <div className="col-xs-12 col-md-8 col-lg-9 position--unset">
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
                    <ItemsComponent 
                      point={this.state.itemsPoint} 
                      wrapperModifier="posts-list clearfix type-2"
                    />
                  </div>
                  <div id="tab-profile-2" role="tabpanel" className="tab-pane fade">
                    <UsersComponent 
                      point={this.state.followingPoint} 
                      usersLabel={Constants.USERS_FILTERS.FOLLOWING.label} 
                      wrapperModifier="posts-list clearfix type-2"
                      getUsers={getFollowing}
                    />
                  </div>
                  <div id="tab-profile-3" role="tabpanel" className="tab-pane fade">
                    <UsersComponent 
                      point={this.state.followersPoint}
                      usersLabel={Constants.USERS_FILTERS.FOLLOWERS.label}  
                      wrapperModifier="posts-list clearfix type-2"
                      getUsers={getFollowers}
                    />
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
