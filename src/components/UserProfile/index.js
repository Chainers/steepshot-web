import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { getUserProfile } from '../../actions/profile';
import { getUserPosts, getUserPostsByCategory } from '../../actions/posts';
import PostItem from '../Posts/Item';
import { connect } from 'react-redux';
import InfiniteScroll from '../Scroller/infinityScroll';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.match.params.username,
      profile: null,
      localize: LocalizedStrings.getInstance(),
      posts: [],
      hasMore: true,
      offset: null
    };
  }

  componentDidMount() {
    let _this = this;

    getUserProfile(this.props.match.params.username).then((result) => {
      const profile = result;

      _this.setState({
        profile: profile,
        avatar: profile.profile_image
      });
    }).then(() => {
      _this.fetchData();
    })
  }

  componentWillReceiveProps(nextProps) {
    this.forceUpdate();
  }

  fetchData() {
    let _this = this;

    getUserPosts(this.props.match.params.username, this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);

      if (response.results.length < 20 || !response.offset) {
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
    this.setState({ avatar: '/src/images/person.png' });
  }

  render() {
    let items = [];
    let _this = this;
    let profileComponent = <div> Loading... </div>;
    let profileImageSrc = this.state.avatar || "/src/images/person.png";

    if (this.state.profile) {
      profileComponent = <div className='user-profile'>
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
          loader={<h4>Loading...</h4>}>
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
