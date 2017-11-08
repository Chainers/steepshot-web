import React from 'react';
import ReactDOM from 'react-dom';
import LocalizedStrings from '../Localization/index.js';
import { 
    getPosts
} from '../../actions/posts';
import { connect } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';
import PostItem from '../Posts/Item';
import Constants from '../../common/constants';
import ModalComponent from '../Common/ModalComponent';
import ItemModal from '../Posts/ItemModal';
import InfiniteScroll from 'react-infinite-scroller';

class ItemsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName : this.props.username,
      loading : true,
      loadingMore : false,
      localize : LocalizedStrings.getInstance(),
      items : [],
      point : this.props.point,
      wrapperModifier : this.props.wrapperModifier,
      cancelPrevious : this.props.cancelPrevious == undefined ? true : this.props.cancelPrevious,
      options : this.props.options,
      getPosts : this.props.getPosts == undefined ? getPosts : this.props.getPosts,
      header : this.props.header,
      renderNotEmptyOnly : this.props.renderNotEmptyOnly == undefined ? false : this.props.renderNotEmptyOnly,
      showHasMore : this.props.showHasMore == undefined ? true : this.props.showHasMore
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        items : [],
        hasMore : true,
        offset : null,
        loading : true,
        loadingMore : false,
        point : nextProps.point,
    }, () => {
      this.fetchData();
    });
  }

  fetchData() {

    if (this.state.items.length > 0)
    this.setState({
        loadingMore : true
    });

    const options = {
      point : this.state.point,
      params : Object.assign({}, {
        offset : this.state.offset
      },
      this.state.options)
    };

    this.state.getPosts(options, this.state.cancelPrevious).then((response) => {
      this.state.items.pop();
      let newPosts = this.state.items.concat(response.results);
      let hasMore = !(this.state.offset == response.offset);
      this.setState({ 
          items: newPosts, 
          offset: response.offset,
          hasMore: hasMore,
          loading : false,
          loadingMore: false
      });
    });
  }

  updateVoteInComponent(vote, index) {
    let newItems = this.state.items;
    if (vote && newItems[index].flag) {
      newItems[index].flag = false;
    }
    vote ? newItems[index].net_votes++ : newItems[index].net_votes--;
    newItems[index].vote = vote;
    this.setState({ 
      items: newItems
    });
  }

  updateFlagInComponent(flag, index) {
    let newItems = this.state.items;
    if (flag && newItems[index].vote) {
      newItems[index].net_votes--;
      newItems[index].vote = false;
    }
    newItems[index].flag = flag;
    this.setState({ 
      items: newItems
    });
  }

  _renderModal() {
      if (this.state.currentItem != undefined)
      return (
        <ItemModal 
          item={this.state.items[this.state.currentItem]} 
          items={this.state.items} 
          index={this.state.currentItem}
          updateVoteInComponent={this.updateVoteInComponent.bind(this)}
          updateFlagInComponent={this.updateFlagInComponent.bind(this)}
          loadMore={this.fetchData.bind(this)}
          hasMore={this.state.hasMore}
        />
      );
      return null;
  }

  openModal(index) {
    this.setState({
        currentItem : index
    },
        jqApp.openPostModal()
    );
  }

  renderItems() {
    if (this.state.loading) return null;
    if (this.state.items.length == 0) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>
      )
    } else {
      let items = [];
      this.state.items.map((post, index) => {
        items.push(
          <PostItem
            key={index}
            item={post}
            index={index}
            openModal={this.openModal.bind(this)}
            updateVoteInComponent={this.updateVoteInComponent.bind(this)}
            updateFlagInComponent={this.updateFlagInComponent.bind(this)}
          />
        );
      })
      return items;
    }
  }

  renderHeader() {
    if (this.state.header) return this.state.header;
    return null;
  }

  renderMainLoader() {
    if (this.state.loading) return <LoadingSpinner />;
    return null;
  }

  renderUploadMore() {
    if (this.state.loading || this.state.items.length == 0 || !this.state.showHasMore) return null;
    if (this.state.loadingMore) {
      return (
        <div className="position--relative">
          <LoadingSpinner />
        </div>
      )
    } else {
      return (
        <div className="load-more" onClick={this.fetchData.bind(this)}>
          <button type="button" className="btn btn-index">Upload more posts</button>
        </div>
      )
    }
  }

  render() {
    
    if (this.state.renderNotEmptyOnly && this.state.items.length == 0) return null;

    return (
      <div> 
        {this.renderHeader()} 
        <div className={this.state.wrapperModifier}>
          <InfiniteScroll
            pageStart={0}
            initialLoad={false}
            loadMore={this.fetchData.bind(this)}
            hasMore={this.state.hasMore}
            loader={
              <div className="position--relative">
                <LoadingSpinner/>
              </div>
            }
          >
            {this.renderItems()}
          </InfiniteScroll>
        </div>
        {this.renderMainLoader()}
        <ModalComponent>
            {this._renderModal()}
        </ModalComponent>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(ItemsComponent);
