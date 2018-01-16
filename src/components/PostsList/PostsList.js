import React from 'react';
import {connect} from 'react-redux';
import {clearPosts, getPostsList, initPostsList} from '../../actions/postsList';
import {debounce} from 'lodash';
import Constants from '../../common/constants';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../LoadingSpinner';
import ShowIf from '../Common/ShowIf';
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
      updateFlagInComponent: this.updateFlagInComponent.bind(this),
      openModal: this.openFunc.bind(this),
      updateVoteInComponent: this.updateVoteInComponent.bind(this),
      point: this.props.point,
      cancelPrevious: this.props.cancelPrevious,
      option: this.props.option,
      maxPosts: this.props.maxPosts,
      loading: true,
      posts: [],
      hashMore: true,
      ignored: this.props.ignored
    };
    this.props.initPostsList(postsListOptions);
    this.getPostsList = this.getPostsList.bind(this);
  }
  
  componentDidUpdate() {
    getPostsList();
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
  
  updateFlagInComponent(flag, index) {
    let newItems = this.state.items;
    let newItems = this.getComponentState().posts;
    if (flag && newItems[index].vote) {
      newItems[index].net_votes--;
      newItems[index].net_likes--;
      newItems[index].vote = false;
    }
    newItems[index].flag = flag;
    this.setState({
      items: newItems,
    });
  }
  
  updateVoteInComponent(vote, index) {
    let newItems = this.state.items;
    //TODO update flag in state
  }
  
  updateVoteInComponent(vote, index) {
    let newItems = this.getComponentState().posts;
    if (vote && newItems[index].flag) {
      newItems[index].flag = false;
    }
    
    vote ? newItems[index].net_votes++ : newItems[index].net_votes--;
    vote ? newItems[index].net_likes++ : newItems[index].net_likes--;
    newItems[index].vote = vote;
    this.setState({
      items: newItems,
    });
  }
  
  renderItems() {
    if (this.props.loading) return null;
    if (!this.props.posts.length) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>
      )
    } else {
      let items = [];
      this.props.post.map((post) => {
        if (this.props.ignored.indexOf(post.url) == -1)
          items.push(
            <PostItem
              item={post}
              index={post.url}
              openModal={this.openFunc.bind(this)}
              updateVoteInComponent={this.updateVoteInComponent.bind(this)}
              clearPostHeader={this.props.clearPostHeader}
            />
          );
      });
      return items;
    }
  }
  
  
  render() {
    //TODO update vote in state
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
    if (!state.postsIndices.length) return null;
    
    return (
      <div className={this.props.className}>
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={debounce(this.getPostsList,
            Constants.ENDLESS_SCROLL.DEBOUNCE_TIMEOUT)}
          hasMore={this.props.hasMore}
          hasMore={state.hasMore}
          loader={
            <div className="position--relative">
              <LoadingSpinner/>
            </div>
          }
          threshold={Constants.ENDLESS_SCROLL.OFFSET}
        >
          <ShowIf show={!this.props.loading}>
            {this.getPosts()}
          </ShowIf>
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
    ...state.postsList[this.props.point],
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
      dispatch(getPostsList(point));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);
