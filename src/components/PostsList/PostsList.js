import React from 'react';
import {connect} from 'react-redux';
import {
  clearPosts, getPostsListAction,
  initPostsList,
} from '../../actions/postsList';
import {debounce} from 'lodash';
import Constants from '../../common/constants';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../LoadingSpinner';
import Post from './Post/Post';

class PostsList extends React.Component {
  static defaultProps = {
    cancelPrevious: false,
    maxPosts: 9999,
    ignored: [],
    clearPostHeader: false,
  };
  
  constructor(props) {
    super(props);
    this.props.clearPosts();
    let postsListOptions = {
      openModal: this.openFunc.bind(this),
      point: this.props.point,
      cancelPrevious: this.props.cancelPrevious,
      option: this.props.option,
      maxPosts: this.props.maxPosts,
      loading: true,
      postsIndices: [],
      length: 0,
      hashMore: true,
    };
    this.props.initPostsList(postsListOptions);
    this.getPostsList = this.getPostsList.bind(this);
    this.getComponentState = this.getComponentState.bind(this);
  }
  
  componentDidMount() {
    this.getPostsList();
  }
  
  getPostsList() {
    this.props.getPosts(this.props.point);
  }
  
  renderPosts() {
    let state = this.getComponentState();
    if (state.loading) return (<div>Loading...</div>);
    if (!state.length) {
      return (
        <div className="empty-query-message_pos-lis">
          {Constants.EMPTY_QUERY}
        </div>
      );
    }
    
    let posts = [];
    state.postsIndices.forEach((postIndex) => {
      if (this.props.ignored.indexOf(postIndex) == -1) {
        posts.push(<Post key={postIndex} index={postIndex}
                         clearPostHeader={this.props.clearPostHeader}/>);
      }
    });
    
    return posts;
  }
  
  openFunc(index) {
  
  }
  
  render() {
    let state = this.getComponentState();
    if (!state) return null;
    
    return (
      <div className={this.props.className}>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={debounce(this.getPostsList,
            Constants.ENDLESS_SCROLL.DEBOUNCE_TIMEOUT)}
          hasMore={state.hasMore}
          loader={
            <div className="position--relative">
              <LoadingSpinner/>
            </div>
          }
          threshold={Constants.ENDLESS_SCROLL.OFFSET}
        >
          {this.renderPosts.bind(this)()}
        </InfiniteScroll>
      </div>
    );
  }
  
  getComponentState() {
    return this.props.postsList[this.props.point];
  }
}

const mapStateToProps = (state) => {
  return {
    postsList: state.postsList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPostsList: (options) => {
      dispatch(initPostsList(options));
    },
    clearPosts: () => {
      dispatch(clearPosts());
    },
    getPosts: (point) => {
      dispatch(getPostsListAction(point));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);
