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

// constants
import constants from '../common/constants';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: [],
      hasMore: true,
      offset: null,
      loading: true,
      activeMode: constants.POST_FILTERS.TRENDING    
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
      this.setPostsByCategory(key, searchValue);
    } else {
      this.setDefaultPosts(key);
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

  // Posts by category
  setPostsByCategory(key, searchValue, isContinue, offset) {
    const callback = this.getCallback(isContinue); 

    if(key == constants.POST_FILTERS.TRENDING) {
      this.setTopPostsByCategory(searchValue, offset, callback);
    } else if(key == constants.POST_FILTERS.HOT) {
      this.setHotPostsByCategory(searchValue, offset, callback);
    } else if(key == constants.POST_FILTERS.NEW) {
      this.setNewPostsByCategory(searchValue, offset, callback);
    } else {
      this.setDefaultData();
    }
  }

  setNewPostsByCategory(searchValue, offset, callback) {
    getNewPostsByCategory(searchValue, offset)
      .then((response) => {
        callback(response);
      });
  }

  setHotPostsByCategory(searchValue, offset, callback) {
    getHotPostsByCategory(searchValue, offset)
      .then((response) => {
        callback(response);
      });
  }

  setTopPostsByCategory(searchValue, offset, callback) {
    getTopPostsByCategory(searchValue, offset)
      .then((response) => {
        callback(response);
      });
  }

  getCallback(isContinue) {
    return isContinue ?
      this.continueHandleDefaultPostsResponce.bind(this) :
      this.handleDefaultPostsResponce.bind(this);
  }

  // Default posts
  setDefaultPosts(key, isContinue, offset) {
    const callback = this.getCallback(isContinue); 

    if(key == constants.POST_FILTERS.TRENDING) {
      this.setTopPosts(offset, callback);
    } else if(key == constants.POST_FILTERS.HOT) {
      this.setHotPosts(offset, callback);
    } else if(key == constants.POST_FILTERS.NEW) {
      this.setNewPosts(offset, callback);
    } else {
      this.setDefaultData();
    }
  }

  setPostsNext() {
    let _this = this;
    getPostsNext().then((response) => {
      _this.handleDefaultPostsResponce(response);
    });
  }

  setNewPosts(offset, callback) {
    getNewPosts(offset).then((response) => {
      callback(response);
    });
  }  

  setHotPosts(offset, callback) {
    getHotPosts(offset).then((response) => {
      callback(response);
    });
  }

  setTopPosts(offset, callback) {
    getTopPosts(offset).then((response) => {
      callback(response);
    });
  }

  handleDefaultPostsResponce(response) {
    this.setState({
      posts: response.results, 
      offset: response.offset,
      loading: false
    });
  }

  continueHandleDefaultPostsResponce(response) {
    this.state.posts.pop();
    let newPosts = this.state.posts.concat(response.results);

    if (!response.offset) {
      this.setState({
        posts: newPosts,
        offset: response.offset, 
        hasMore: false,
        loading: false
      });
    } else {
      this.setState({
        posts: newPosts, 
        offset: response.offset,
        loading: false
      });
    }
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
    let _this = this;
    const search = this.props.search.value;
    const key = this.state.activeMode;
    const offset = this.state.offset;

    this.setPostsByCategory(key, search, true, offset);
  }

  fetchPostsNext() {
    let _this = this;
    const key = this.state.activeMode;
    const offset = this.state.offset;

    this.setDefaultPosts(key, true, offset);
  }

  updateVoteInComponent(vote, index) {
    let newItems = items;
    vote ? newItems[index].net_votes++ : newItems[index].net_votes--;
    newItems[index].vote = vote;
    this.setState({ 
      items: newItems
    });
  }

  updateFlagInComponent(flag, index) {
    let newItems = this.state.items;
    newItems[index].flag = flag;
    this.setState({ 
      items: newItems
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
    } else if (this.props.search.value == '') {
      renderElements = <div className='loading-block'>
        <LoadingSpinner />
      </div>;
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
