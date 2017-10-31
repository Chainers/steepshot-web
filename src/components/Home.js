import React from 'react';
import {
  getPosts, 
  getNewPosts,
  getHotPosts,
  getTopPosts,
  getNewPostsByCategory,
  getHotPostsByCategory,
  getTopPostsByCategory
} from '../actions/posts';
import PostItem from './Posts/Item';
import { 
  connect, 
  store 
} from 'react-redux';
import InfiniteScroll from './Scroller/infinityScroll';
import PropTypes from 'prop-types';
import PostFilterBlock from './Filters/PostFilterBlock';
import { 
  getStore 
} from '../store/configureStore';
import Loading from 'react-loading-spinner';
import LoadingSpinner from './LoadingSpinner';
import ModalComponent from './Common/ModalComponent';
import ItemModal from './Posts/ItemModal';

// constants
import constants from '../common/constants';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      hasMore: false,
      offset: null,
      loading: true,
      activeMode: constants.POST_FILTERS.TRENDING    
    };
  }

  componentWillMount() {
    this.store = getStore();
    this.outputUpdate();
    this.resetPosts();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      currentItem : null
    })
  }

  outputUpdate() {
    this.unsubscribe = this.store.subscribe(() => {
      this.resetPosts(this.store.getState().search.value);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  updatePostsByFolter(key) {
    this.setState({ 
      activeMode: key 
    });
    this.resetPosts(null, key);
  }

  resetPosts(searchValue, key) {
    this.setDefaultData();
    key = key || this.state.activeMode;
    if ((searchValue == null || searchValue == undefined) && this.props.search.value != "") {
      searchValue = searchValue || this.props.search.value;
    }

    if (searchValue) {
      this.setPosts(key, false, null, searchValue);
    } else {
      this.setPosts(key, false);
    }
  }

  setDefaultData() {
    this.setState({
      posts: [],
      offset: null,
      loading: true
    });
  }

  resetOffset() {
    this.setState({
      offset: null
    });
  }

  getCallback(isContinue) {
    return isContinue ?
      this.continueHandleDefaultPostsResponce.bind(this) :
      this.handleDefaultPostsResponce.bind(this);
  }

  insertCategory(point, category) {
    if (category == undefined) return point;
    let path = point.split('/');
    return `${path[0]}/${category}/${point[1]}`;
  }

  setPosts(key, isContinue, offset, searchValue) {
    const callback = this.getCallback(isContinue); 
    let options = {
      params : {
        offset : offset
      }
    }
    switch (key) { 
      case constants.POST_FILTERS.TRENDING :
        options.point = this.insertCategory(constants.POSTS_POINTS.POSTS_TOP, searchValue);
        this.getPosts(options, callback);
        break;
      case constants.POST_FILTERS.HOT :
        options.point = this.insertCategory(constants.POSTS_POINTS.POSTS_HOT, searchValue);
        this.getPosts(options, callback);
        break;
      case constants.POST_FILTERS.NEW :
        options.point = this.insertCategory(constants.POSTS_POINTS.POSTS_NEW, searchValue);
        this.getPosts(options, callback);
        break;
      default :
        this.setDefaultData();
    }
  }

  getPosts(options, callback) {
    getPosts(options)
    .then(response => callback(response));
  }  

  handleDefaultPostsResponce(response) {

    let hasMore = !(this.state.offset == response.offset);

    this.setState({
      posts: response.results, 
      offset: response.offset,
      hasMore: hasMore,
      loading: false
    });
  }

  continueHandleDefaultPostsResponce(response) {
    this.state.posts.pop();
    let newPosts = this.state.posts.concat(response.results);

    let hasMore = !(this.state.offset == response.offset);
    
    this.setState({ 
        posts: newPosts, 
        offset: response.offset,
        hasMore: hasMore,
        loading: false
    });
  }
  
  // Fetch data
  fetchData() {
    this.setState({
      loading: true
    })
    if (this.props.search.value) {
      this.fetchPostsByCategory();
    } else {
      this.fetchPostsNext();
    }
  }

  fetchPostsByCategory() {
    this.setPosts(this.state.activeMode, false, this.state.offset, this.props.search.value);
  }

  fetchPostsNext() {
    this.setPosts(this.state.activeMode, true, this.state.offset);
  }

  updateVoteInComponent(vote, index) {
    let newItems = this.state.posts;
    if (vote && newItems[index].flag) {
      newItems[index].flag = false;
    }
    vote ? newItems[index].net_votes++ : newItems[index].net_votes--;
    newItems[index].vote = vote;
    this.setState({ 
      posts: newItems
    });
  }

  updateFlagInComponent(flag, index) {
    let newItems = this.state.posts;
    if (flag && newItems[index].vote) {
      newItems[index].net_votes--;
      newItems[index].vote = false;
    }
    newItems[index].flag = flag;
    this.setState({ 
      posts: newItems
    });
  }

  _renderModal() {
    if (this.state.currentItem != undefined)
    return <ItemModal 
                item={this.state.posts[this.state.currentItem]} 
                items={this.state.posts} 
                index={this.state.currentItem}
                updateVoteInComponent={this.updateVoteInComponent.bind(this)} 
                loadMore={this.fetchPostsNext.bind(this)}
                updateFlagInComponent={this.updateFlagInComponent.bind(this)}
                hasMore={this.state.hasMore}
            />
    return null;
  }

  openModal(index) {
    this.setState({
        currentItem : index
    },
        jqApp.openPostModal()
    );
  }

  render() {
    let items = [];
    let needsLoader = false;
    let _this = this;
    let renderElements = <div className='loading-block'><LoadingSpinner /></div>;

    if (!this.state.loading && this.state.posts.length == 0) {
      renderElements = <div className='loading-block'><br /><h4>No find results for '{this.props.search.value}' filter</h4></div>;
    }

    if (this.state.posts.length > 0) {
      this.state.posts.map((post, index) => {
        items.push(<PostItem
          key={index}
          item={post}
          items={_this.state.posts}
          index={index}
          history={this.props.history}
          openModal={this.openModal.bind(this)}
          updateVoteInComponent={this.updateVoteInComponent.bind(this)}
          updateFlagInComponent={this.updateFlagInComponent.bind(this)}
        />);
      });

      renderElements = items;
    } else {
      renderElements = null;
      needsLoader = true;
    }

    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content col-xs-12 clearfix">
          <PostFilterBlock updatePostsCallback={this.updatePostsByFolter.bind(this)}/>
            <div className="tab-content">
              <div className="posts-list clearfix" id="all-posts">
                {renderElements}
              </div>
              { 
                this.state.hasMore && !this.state.loading ? 
                  <div className="load-more" onClick={this.fetchData.bind(this)}>
                    <button type="button" className="btn btn-index">Upload more posts</button>
                  </div> : null 
              }
              {
                this.state.hasMore && this.state.loading && this.state.posts.length !== 0 ? 
                <div className='loading-block'>
                  <LoadingSpinner />
                </div> : null 
              }
            </div>
        </div>
        {
          needsLoader
          ?
            <LoadingSpinner />
          :
            null
        }
        <ModalComponent>
            {this._renderModal()}
        </ModalComponent>
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
