import React from 'react';
import { getPosts, getPostsNext, getPostsByCategory } from '../actions/posts';
import PostItem from './Posts/Item';
import { connect, store } from 'react-redux';
import InfiniteScroll from './Scroller/infinityScroll';
import PropTypes from 'prop-types';
import { getStore } from '../store/configureStore';
import PostFilterBlock from './Filters/PostFilterBlock';

// constants
import constants from '../common/constants';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      hasMore: true,
      offset: null
    };

    
    this.store = getStore();
    this.outputUpdate();
    this.resetPosts();
  }

  outputUpdate() {
    this.unsubscribe = this.store.subscribe(() => {
      this.resetPosts(this.store.getState().search.value);
    });
  }

  componentDidMount() {
    this.unsubscribe();
  }

  updatePostsByFolter(key) {
    this.resetPosts(null, key);
  }

  resetPosts(searchValue, key) {
    this.setState({posts: [], offset: null});

    if (searchValue) {
      this.setPostsByCategory(searchValue);
    } else if(key == constants.POST_FILTERS.TRANDING) {
      this.setPostsNext();
    } else {
      this.setPostsNext();
    }
  }

  setPostsByCategory(searchValue) {
    let _this = this;
    getPostsByCategory(searchValue).then((response) => {
      _this.setState({posts: response.results, offset: response.offset});
    });
  }

  setPostsNext() {
    let _this = this;
    getPostsNext().then((response) => {
      _this.setState({posts: response.results, offset: response.offset});
    });
  }

  fetchData() {
    if (this.props.search.value) {
      this.fetchPostsByCategory();
    } else {
      this.fetchPostsNext();
    }
  }

  fetchPostsByCategory() {
    let _this = this;
    let search = this.props.search.value;
    getPostsByCategory(search, this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);
      if (response.results.lenght < 20) {
        _this.setState({posts: newPosts, offset: response.offset, hasMore: false});
      } else {
        _this.setState({posts: newPosts, offset: response.offset});
      }
    });
  }

  fetchPostsNext() {
    let _this = this;
    getPostsNext(this.state.offset).then((response) => {
      this.state.posts.pop();
      let newPosts = this.state.posts.concat(response.results);
      if (response.results.lenght < 20) {
        _this.setState({posts: newPosts, offset: response.offset, hasMore: false});
      } else {
        _this.setState({posts: newPosts, offset: response.offset});
      }
    });
  }

  render() {
    let items = [];
    let _this = this;
    let renderElements = <div className='loading-block'><br /><h4>No find results for '{this.props.search.value}' filter</h4></div>;

    if (this.state.posts.length > 0) {
      this.state.posts.map((post, index) => {
        items.push(<PostItem key={index} item={post} items={_this.state.posts} index={index} loadMore={this.fetchData.bind(this)}/>);
      });

      renderElements = <InfiniteScroll
          next={this.fetchData.bind(this)}
          hasMore={this.state.hasMore}
          loader={<div className='loading-block'><br /><h4>Loading...</h4></div>}
          endMessage={
            <p style={{textAlign: 'center'}}>
              <b>Yay! You have seen it all</b>
            </p>
          }>
          {items}
        </InfiniteScroll>;
    } else if(this.props.search.value == '') {
      renderElements = <div className='loading-block'><br /><h4>Loading...</h4></div>;
    }

    return (
      <div className="container" id="all-posts">
        <PostFilterBlock updatePostsCallback={this.updatePostsByFolter.bind(this)}/>
        {renderElements}
      </div>
    );
  }
}

Home.propTypes = {
  search: PropTypes.object.isRequired
};

Home.contextTypes = {
  store: React.PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization,
    search: state.search
  };
};

export default connect(mapStateToProps)(Home);
