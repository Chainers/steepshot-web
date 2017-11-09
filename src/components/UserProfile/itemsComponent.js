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
import { debounce } from 'lodash';

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
      cancelPrevious : this.props.cancelPrevious == undefined ? false : this.props.cancelPrevious,
      options : this.props.options,
      getPosts : this.props.getPosts == undefined ? getPosts : this.props.getPosts,
      header : this.props.header,
      renderNotEmptyOnly : this.props.renderNotEmptyOnly == undefined ? false : this.props.renderNotEmptyOnly,
      previousRequestOffset : 'none',
      isComponentVisible : this.props.isComponentVisible == undefined ? true : this.props.isComponentVisible,
      hasMore : true,
      maxPosts : this.props.maxPosts || 9999
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
        isComponentVisible : nextProps.isComponentVisible
    });
  }

  fetchData() {
    if (this.state.offset == this.state.previousRequestOffset || !this.state.hasMore) return false;
    if (!this.state.isComponentVisible && this.state.offset != undefined) return false;
    if (this.state.items.length > this.state.maxPosts - 1) {
      this.setState({ hasMore : false });
      return false;
    } 
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
        let hasMore = !(this.state.offset == response.offset) ;
        if (this.state.items.length + response.results.length == 0) hasMore = false;
        this.setState({ 
            items: newPosts,
            previousRequestOffset : this.state.offset,
            offset: response.offset,
            hasMore: hasMore,
            loading : false
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
        jqApp.openPostModal($(ReactDOM.findDOMNode(this)))
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

  render() {
    
    if (this.state.renderNotEmptyOnly && this.state.items.length == 0) return null;

    return (
      <div> 
        {this.renderHeader()} 
        <InfiniteScroll
          pageStart={0}
          initialLoad={false}
          loadMore={debounce(this.fetchData.bind(this), Constants.ENDLESS_SCROLL.DEBOUNCE_TIMEOUT)}
          hasMore={this.state.hasMore}
          loader={
            <div className="position--relative">
              <LoadingSpinner/>
            </div>
          }
          threshold={Constants.ENDLESS_SCROLL.OFFSET}
        >
          <div className={this.state.wrapperModifier}>
            {this.renderItems()}
          </div>
        </InfiniteScroll>
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
