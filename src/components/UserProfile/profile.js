import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { 
  getUserProfile,
  getFollowers,
  getFollowing
} from '../../actions/profile';
import { 
  getUserPosts, 
  getUserPostsByCategory 
} from '../../actions/posts';
import PostItem from '../Posts/Item';
import { connect } from 'react-redux';
import InfiniteScroll from '../Scroller/infinityScroll';
import FollowComponent from '../Posts/FollowComponent';
import Modal from 'react-modal';
import PopoutFollow from './popoutFollow';
import LoadingSpinner from '../LoadingSpinner';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.username,
      profile: null,
      localize: LocalizedStrings.getInstance(),
      showFollow: this.props.showFollow != undefined ? this.props.showFollow  : true,
      posts: [],
      followers: [],
      following: [],
      hasMore: true,
      offset: null,
      modalIsOpen: false,
      followCallback: () => {},
      followTitle: ''
    };
  }

  componentDidMount() {
    this.getUserProfile();
  }

  getUserProfile(userName) {
    let _this = this;

    userName = userName || this.props.username;

    getUserProfile(userName).then((result) => {
      const profile = result;

      _this.setState({
        profile: profile,
        avatar: profile.profile_image
      });
    }).then(() => {
      _this.fetchData();
    });
  }

  showFollowersPopup() {
    this.setState({ 
      followCallback: getFollowers.bind(this),
      followTitle: 'Followers' 
    });
  }


  showFollowingPopup() {
    this.setState({ 
      followCallback: getFollowing.bind(this),
      followTitle: 'Following' 
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username === this.state.authorName) {
        return;
    }

    this.setState({
        authorName: nextProps.username,
        profile: null,
        posts: [],
        hasMore: true,
        offset: null
    });

    this.getUserProfile(nextProps.username);
  }

  fetchData() {
    let _this = this;

    getUserPosts(this.props.username, this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);

      if (response.count < 20 || !response.offset) {
        _this.setState({
          posts: newPosts, 
          offset: response.offset, 
          hasMore: false
        });
      } else {
        _this.setState({ 
          posts: newPosts, 
          offset: response.offset
        });
      }
    });
  }

  setDefaultAvatar() {
    this.setState({ avatar: 'src/images/person.png' });
  }

  render() {
    let items = [];
    let _this = this;
    let profileComponent = <div className='loading-block'><LoadingSpinner /></div>;
    let profileImageSrc = this.state.avatar || "src/images/person.png";
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

      // profileComponent = <div className='user-profile'>
      //   <img className="user-big-avatar" 
      //     src={profileImageSrc} 
      //     alt="Image" 
      //     onError={this.setDefaultAvatar.bind(this)}/>
      //   <div className='profile-info'>
      //     <div>
      //       <h3>{this.state.profile.username}</h3>
      //     </div>
      //     <div>
      //       <span><strong>{this.state.profile.post_count}</strong> posts</span>
      //       <span onClick={this.showFollowersPopup.bind(this)}>
      //         <strong className="follow-text">{this.state.profile.followers_count}</strong> followers
      //       </span>
      //       <span onClick={this.showFollowingPopup.bind(this)}>
      //         <strong className="follow-text">{this.state.profile.following_count}</strong> following
      //       </span>
      //     </div>
      //     <Modal
      //       isOpen={this.state.modalIsOpen}
      //       onAfterOpen={this.afterOpenModal.bind(_this)}
      //       onRequestClose={this.closeModal}
      //       className='popout-container'
      //       contentLabel="Example Modal"
      //     >
      //       <PopoutFollow
      //         followCallback={this.state.followCallback}
      //         title={this.state.followTitle}
      //         requestKey={this.props.username}
      //         closeModal={this.closeModal}/>
      //     </Modal>
      //     <div>
      //       <span><strong>{this.state.profile.name}</strong> {this.state.profile.about} <a
      //         href={this.state.profile.website}>{this.state.profile.website}</a></span>
      //     </div>
      //     <div>
      //       { this.state.showFollow ? <FollowComponent item={this.state.profile} /> : null }
      //     </div>
      //   </div>
      // </div>
    }

    this.state.posts.map((post, index) => {
      items.push(<PostItem
        key={index}
        item={post}
        items={_this.state.posts}
        index={index}
        history={this.props.history}
        loadMore={this.fetchData.bind(this)} />
      );
    });

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
                      onError={this.setDefaultAvatar.bind(this)}/> />
                  </div>
                  <div className="btn-wrap">
                    <button type="button" className="btn btn-default">Follow</button>
                  </div>
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
                    <a href="#tab-profile-1" 
                      aria-controls="tab-profile-1" 
                      role="tab" 
                      data-toggle="tab" 
                      className="tab-head"
                    >
                      {postsCount} Posts
                    </a>
                  </li>
                  <li role="presentation">
                    <a href="#tab-profile-2" 
                      aria-controls="tab-profile-2" 
                      role="tab" data-toggle="tab" 
                      className="tab-head"
                    >
                      {followingCount} Following
                    </a>
                  </li>
                  <li role="presentation">
                    <a href="#tab-profile-3" 
                      aria-controls="tab-profile-3" 
                      role="tab" 
                      data-toggle="tab" 
                      className="tab-head"
                    >
                      {followersCount} Followers
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="tab-profile-1" role="tabpanel" className="tab-pane fade in active">
                    <div className="posts-list clearfix type-2">
                      {items}
                    </div>
                    <div className="load-more">
                      <button type="button" className="btn btn-index">Upload more posts</button>
                    </div>
                  </div>
                  <div id="tab-profile-2" role="tabpanel" className="tab-pane fade">
                    <div className="posts-list clearfix type-2">
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-1.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-2.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-3.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-4.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-5.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-6.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-7.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-8.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-9.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-10.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-11.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-12.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-13.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-14.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-15.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-16.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-17.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-wrap">
                        <div className="user-card">
                          <div className="card-wrap clearfix">
                            <div className="pic"><a href="#"><img src="images/tmp/user-avatar-18.png" alt="user"/></a></div>
                            <div className="text"><a href="#" className="name">@ellenwalters</a>
                              <div className="location">London, United Kindom</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="load-more">
                      <button type="button" className="btn btn-index">Upload more following</button>
                    </div>
                  </div>
                  <div id="tab-profile-3" role="tabpanel" className="tab-pane fade">
                    <div className="empty-query-message">The user has not created any entries yet. Perhaps you need to wait a bit ...</div>
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
    localization: state.localization
  };
};

export default connect(mapStateToProps)(UserProfile);
