import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { getUserProfile } from '../../actions/profile';
import { getUserPosts } from '../../actions/posts';
import PostItem from '../Posts/Item';
import { connect } from 'react-redux';
import InfiniteScroll from '../Scroller/infinityScroll';

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.routeParams.username,
      profile: null,
      localize: LocalizedStrings.getInstance(),
      posts: [],
      hasMore: true,
      offset: null
    };
  }

  componentDidMount() {
    let _this = this;

    getUserProfile(this.props.routeParams.username).then((result) => {
      _this.setState({profile: result});
    }).then(() => {
      _this.fetchData();
    })
  }

  fetchData() {
    let _this = this;

    getUserPosts(this.props.routeParams.username, this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);

      if (response.results.lenght == 1) {
        _this.setState({posts: newPosts, offset: response.offset, hasMore: false});
      } else {
        _this.setState({posts: newPosts, offset: response.offset});
      }
    });
  }

  render() {
    let items = [];
    let _this = this;
    let profileComponent = <div> Loading... </div>;
    let profileImageSrc = "../../images/person";

    if (this.state.profile && this.state.profile.profile_image) {
      profileImageSrc = this.state.profile.profile_image;
    }
    if (this.state.profile) {
      profileComponent = <div className='user-profile'>
        <img className="user-big-avatar" src={profileImageSrc} alt="Image"/>
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
      items.push(<PostItem item={post} items={_this.state.posts} index={index} loadMore={this.fetchData.bind(this)} />);
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
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{textAlign: 'center'}}>
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
