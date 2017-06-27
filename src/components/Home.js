import React from 'react';
import { getPosts, getPostsNext } from '../actions/posts';
import PostItem from './Posts/Item';
import { connect } from 'react-redux';
import InfiniteScroll from './Scroller/infinityScroll';

class Home extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			posts: [],
			hasMore: true
		};
	}

  componentDidMount() {
		let _this = this;

    getPostsNext().then((response) => {
      _this.setState({ posts: response});
		});
	}

	fetchData() {
		let _this = this;
		let offset;

		if (this.state.posts.length != 0) {
			let lastItem = this.state.posts.pop();
			offset = lastItem.url;
		}

		getPostsNext(offset).then((response) => {
			let newPosts = this.state.posts.concat(response);
      _this.setState({ posts: newPosts, hasMore: false});
		});
	}

	refresh() {
		console.log("refresh");
	}

	render() {
    let items = [];
		let _this = this;

    this.state.posts.map((post, index) => {
      items.push(<PostItem item={post} items={_this.state.posts} index={index}/>);
    });

    return (
      <div className="container" id="all-posts">
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
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Home);
