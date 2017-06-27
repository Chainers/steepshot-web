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
      posts: []
    };
  }

  componentDidMount() {
    let _this = this;

    getUserProfile(this.props.routeParams.username).then((result) => {
      _this.setState({ profile: result});
    }).then(() => {
      _this.fetchData();
    })
  }

  fetchData() {
		let _this = this;
		let offset;

		if (this.state.posts.length != 0) {
			let lastItem = this.state.posts.pop();
			offset = lastItem.url;
		}

		getUserPosts(this.state.profile.username, offset).then((response) => {
			let newPosts = this.state.posts.concat(response);
      _this.setState({ posts: newPosts, hasMore: false});
		});
	}

  render() {
    let items = [];
		let _this = this;
    let profileComponent = <div> Loading... </div>;

    if (this.state.profile) {
      profileComponent = <div className='user-profile'>
          <img className="user-big-avatar" src={this.state.profile.profile_image} alt="Image" />
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
              <span><strong>{this.state.profile.name}</strong> {this.state.profile.about} <a>{this.state.profile.website}</a></span>
            </div>
          </div>
        </div>
    }

    this.state.posts.map((post, index) => {
      items.push(<PostItem item={post} items={_this.state.posts} index={index}/>);
    });

    return (
      <div>
        <br/>
        {profileComponent}
        <hr/>
        <InfiniteScroll
          refreshFunction={this.refresh}
          next={this.fetchData.bind(this)}
          hasMore={true}
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
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(UserProfile);
