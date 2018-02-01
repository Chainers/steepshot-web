import React from 'react';
import {connect} from 'react-redux';
import {getPostsList, initPostsList} from '../../actions/postsList';
import {debounce} from 'lodash';
import Constants from '../../common/constants';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../LoadingSpinner';
import Post from './Post/Post';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';

class PostsList extends React.Component {
  static defaultProps = {
    cancelPrevious: false,
    maxPosts: 9999,
    clearPostHeader: false,
    isComponentVisible: true,
    headerText: ''
  };

  constructor(props) {
    super(props);
    let postsListOptions = {
      point: this.props.point,
      cancelPrevious: this.props.cancelPrevious,
      options: this.props.options,
      maxPosts: this.props.maxPosts,
      loading: false,
      posts: [],
      length: 0,
      hasMore: true,
      loader: true
    };
    this.props.initPostsList(postsListOptions);
  }

  componentDidMount() {
    this.props.getPosts(this.props.point);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.point !== this.props.point) {
      let postsListOptions = {
        point: nextProps.point,
        cancelPrevious: nextProps.cancelPrevious,
        options: nextProps.options,
        maxPosts: nextProps.maxPosts,
        loading: false,
        posts: [],
        length: 0,
        hasMore: true,
      };
      this.props.initPostsList(postsListOptions);
      this.props.getPosts(nextProps.point);
    }
  }

  renderPosts() {
    if(this.props.loader) {
      return (
        <span/>
      )
    }
    if (!this.props.length) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>
      );
    }
    let posts = [];
    this.props.posts.forEach((postIndex, index) => {
      if (this.props.ignored.indexOf(postIndex) === -1) {
        posts.push(<Post key={index}
                         index={postIndex}
                         point={this.props.point}
                         clearPostHeader={this.props.clearPostHeader}
        />);
      }
    });
    return posts;
  }

  renderHeader() {
    if (this.props.headerText) return (
      <HeadingLeadComponent text={this.props.headerText} />
    );
    return null;
  }

  render() {
    return (
      <div className={this.props.className}>
        {this.renderHeader()}
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={debounce(() => this.props.getPosts(this.props.point),
          Constants.ENDLESS_SCROLL.DEBOUNCE_TIMEOUT)}
          hasMore={this.props.isComponentVisible && this.props.hasMore}
          loader={<LoadingSpinner/>}
          threshold={Constants.ENDLESS_SCROLL.OFFSET}
        >
        <div className="posts-list container_pos-lis">
          {this.renderPosts()}
        </div>
        </InfiniteScroll>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.postsList[props.point],
    point: props.point,
    ignored: state.postsList[props.ignored] ? state.postsList[props.ignored].posts : []
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPostsList: (options) => {
      dispatch(initPostsList(options));
    },
    getPosts: (point) => {
      dispatch(getPostsList(point));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);
