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
			hasMore: true,
			offset: null
		};
	}

  componentDidMount() {
		let _this = this;

    getPostsNext().then((response) => {
      _this.setState({ posts: response.results, offset: response.offset });
		});
	}

	fetchData() {
		let _this = this;

		getPostsNext(this.state.offset).then((response) => {
			this.state.posts.pop();
			let newPosts = this.state.posts.concat(response.results);
			if (response.results.lenght == 1) {
				_this.setState({ posts: newPosts, offset: response.offset, hasMore: false });
			} else {
      	_this.setState({ posts: newPosts, offset: response.offset });
			}
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

export default connect(mapStateToProps)(Home);
