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
      hasMore: true,
      offset: null,
      modalIsOpen: false,
      followCallback: () => {},
      followTitle: ''
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
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
    this.openModal();
  }


  showFollowingPopup() {
    this.setState({ 
      followCallback: getFollowing.bind(this),
      followTitle: 'Following' 
    });
    this.openModal();
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

    if (this.state.profile) {
      profileComponent = <div className='user-profile'>
        <img className="user-big-avatar" src={profileImageSrc} alt="Image" onError={this.setDefaultAvatar.bind(this)}/>
        <div className='profile-info'>
          <div>
            <h3>{this.state.profile.username}</h3>
          </div>
          <div>
            <span><strong>{this.state.profile.post_count}</strong> posts</span>
            <span onClick={this.showFollowersPopup.bind(this)}>
              <strong className="follow-text">{this.state.profile.followers_count}</strong> followers
            </span>
            <span onClick={this.showFollowingPopup.bind(this)}>
              <strong className="follow-text">{this.state.profile.following_count}</strong> following
            </span>
          </div>
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal.bind(_this)}
            onRequestClose={this.closeModal}
            className='popout-container'
            contentLabel="Example Modal"
          >
            <PopoutFollow
              followCallback={this.state.followCallback}
              title={this.state.followTitle}
              requestKey={this.props.username}
              closeModal={this.closeModal}/>
          </Modal>
          <div>
            <span><strong>{this.state.profile.name}</strong> {this.state.profile.about} <a
              href={this.state.profile.website}>{this.state.profile.website}</a></span>
          </div>
          <div>
            { this.state.showFollow ? <FollowComponent item={this.state.profile} /> : null }
          </div>
        </div>
      </div>
    }

    this.state.posts.map((post, index) => {
      items.push(<PostItem key={index} item={post} items={_this.state.posts} index={index} loadMore={this.fetchData.bind(this)} />);
    });

    return (
      <div>
        <br/>
        {profileComponent}
        <hr/>
        <InfiniteScroll
          refreshFunction={this.refresh}
          next={this.fetchData.bind(this)}
          hasMore={this.state.hasMore}
          loader={<div className='loading-block'><LoadingSpinner /></div>}
          endMessage={
            <p className='loading-block'>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {items}
        </InfiniteScroll>
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
