import React from 'react';
import {connect} from 'react-redux';
import {
  clearPostsList, getPostsListAction,
  initPostsList,
} from '../../actions/postsList';
import {debounce} from 'lodash';
import Constants from '../../common/constants';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../LoadingSpinner';
import Post from './Post/Post';
import ItemModal from '../Posts/ItemModal';
import {openModal} from '../../actions/modal';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';
import ShowIf from "../Common/ShowIf";

class PostsList extends React.Component {
  static defaultProps = {
    cancelPrevious: false,
    maxPosts: 9999,
    ignored: [],
    clearPostHeader: false
  };

  constructor(props) {
    super(props);
    this.props.clearPosts();
    let postsListOptions = {
      point: this.props.point,
      cancelPrevious: this.props.cancelPrevious,
      option: this.props.option,
      maxPosts: this.props.maxPosts,
      loading: false,
      postsIndices: [],
      length: 0,
      hasMore: true,
    };
    this.props.initPostsList(postsListOptions);
    this.getPostsList = this.getPostsList.bind(this);
  }

  componentDidMount() {
    this.getPostsList();
  }

  getPostsList() {
    this.props.getPosts(this.props.point);
  }

  renderPosts() {
    if (!this.props.length) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>
      );
    }
    let posts = [];
    this.props.postsIndices.forEach((postIndex) => {
      if (this.props.ignored.indexOf(postIndex) == -1) {
        posts.push(<Post key={this.props.point + "/" + postIndex}
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
    console.log(this.props);
    if (!this.props.length) return null;
    return (
      <div className={this.props.className}>
        {this.renderHeader()}
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={debounce(this.getPostsList,
          Constants.ENDLESS_SCROLL.DEBOUNCE_TIMEOUT)}
          hasMore={this.props.isComponentVisible && this.props.hasMore}
          loader={
            <div className="position--relative">
              <LoadingSpinner/>
            </div>
          }
          threshold={Constants.ENDLESS_SCROLL.OFFSET}
        >
          <div className="posts-list container_pos-lis">
            {this.renderPosts.bind(this)()}
          </div>
        </InfiniteScroll>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.postsList[props.point],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initPostsList: (options) => {
      dispatch(initPostsList(options));
    },
    clearPosts: () => {
      dispatch(clearPostsList());
    },
    getPosts: (point) => {
      dispatch(getPostsListAction(point));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostsList);
