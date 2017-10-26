import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { 
    getUserPosts
} from '../../actions/posts';
import { connect } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';
import PostItem from '../Posts/Item';
import contants from '../../common/constants';
import ModalComponent from '../Common/ModalComponent';
import ItemModal from '../Posts/ItemModal';

class ItemsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.username,
      currentUser: this.props.currentUser,
      loading: true,
      hasMore: true,
      localize: LocalizedStrings.getInstance(),
      items: []
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.username === this.state.authorName) {
        return;
    }

    this.setState({
        authorName: nextProps.username,
        items: [],
        hasMore: true,
        offset: null,
        loading: true
    });

    this.fetchData(nextProps.username, null);
  }

  fetchData(userName, offset) {
    this.setState({
        loading: true
    });
    let _this = this;
    userName = userName || this.state.authorName;
    offset = offset !== undefined ? offset : this.state.offset;

    getUserPosts(userName, offset).then((response) => {
      _this.state.items.pop();
      let newPosts = _this.state.items.concat(response.results);

      let hasMore = !(_this.state.offset == response.offset);
      
      _this.setState({ 
          items: newPosts, 
          offset: response.offset,
          hasMore: hasMore,
          loading: false
      });
    });
  }

  setDefaultAvatar() {
    this.setState({ avatar: contants.NO_AVATAR });
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
      return <ItemModal 
                  item={this.state.items[this.state.currentItem]} 
                  items={this.state.items} 
                  index={this.state.currentItem}
                  updateVoteInComponent={this.updateVoteInComponent.bind(this)}
                  updateFlagInComponent={this.updateFlagInComponent.bind(this)}
                  loadMore={this.fetchData.bind(this)}
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
    let _this = this;
    let items = [];

    this.state.items.map((post, index) => {
        items.push(<PostItem
            key={index}
            item={post}
            items={_this.state.items}
            index={index}
            history={this.props.history}
            loadMore={this.fetchData.bind(this)}
            openModal={this.openModal.bind(this)}
            updateVoteInComponent={this.updateVoteInComponent.bind(this)}
            updateFlagInComponent={this.updateFlagInComponent.bind(this)}
          />
        );
    });

    let renderComponent = items;
    let updateButton = null;

    if (this.state.items.length === 0 && !this.state.loading) {
      renderComponent = <div className="empty-query-message">It's very strange, but we do not have anything yet for this query. Try to look for something else ...</div>;
    }
    
    if (this.state.hasMore && !this.state.loading && this.state.items.length !== 0) {
      updateButton = <div className="load-more" onClick={this.fetchData.bind(this, this.state.authorName, this.state.offset)}>
          <button type="button" className="btn btn-index">Upload more posts</button>
        </div>;
    } else if (this.state.hasMore && this.state.loading && this.state.items.length === 0) {
      updateButton = <LoadingSpinner />;
    }

    return (
      <div>
        <div className="posts-list clearfix type-2">
          {renderComponent}
        </div>
        {updateButton}
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
