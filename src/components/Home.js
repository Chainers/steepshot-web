import React from 'react';
import { getPosts } from '../actions/posts';
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

    getPosts().then((response) => {
      _this.setState({ posts: response});
		});
	}

	fetchData() {
		let _this = this;

		getPosts().then((response) => {
			let newPosts = this.state.posts.concat(response);
      _this.setState({ posts: newPosts, hasMore: false});
		});
	}

	refresh() {
		console.log("refresh");
	}

	render() {
    let items = [];

    this.state.posts.map((post) => {
      items.push(<PostItem item={post}/>);
    });

    return (
      <div className="container" id="all-posts">
        <InfiniteScroll
          pullDownToRefresh
          pullDownToRefreshContent={
            <h3 style={{textAlign: 'center'}}>&#8595; Pull down to refresh</h3>
          }
          releaseToRefreshContent={
            <h3 style={{textAlign: 'center'}}>&#8593; Release to refresh</h3>
          }
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
