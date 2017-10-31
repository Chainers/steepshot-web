import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import {
  getFollowing
} from '../../actions/posts';
import { connect } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';
import UserItem from './userItem';
import contants from '../../common/constants';

class FollowingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorName: this.props.username,
      profile: null,
      loading: true,
      hasMore: true,
      localize: LocalizedStrings.getInstance(),
      items: [],
      currentUser: this.props.currentUser
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

    const options = {
      point : `user/${userName}/following`,
      params : {
        offset : offset
      }
    }

    getFollowing(options, true).then((response) => {
        _this.state.items.pop();
        let newItems = _this.state.items.concat(response.results);     

        let hasMore = !(_this.state.offset == response.offset);

        _this.setState({ 
            items: newItems, 
            offset: response.offset,
            hasMore: hasMore,
            loading: false
        });
        
    });
  }

  setDefaultAvatar() {
    this.setState({ avatar: contants.NO_AVATAR });
  }

  render() {
    let items = [];
    let profileComponent = <div className='loading-block'><LoadingSpinner /></div>;
    let profileImageSrc = this.state.avatar || contants.NO_AVATAR;

    this.state.items.map((user, index) => {
      items.push(<UserItem
        key={index}
        item={user}
        history={this.props.history} />
      );
    });

    let renderComponent = items;
    let updateButton = null;
    
    if (this.state.items.length === 0 && !this.state.loading) {
      renderComponent = <div className="empty-query-message">It's very strange, but we do not have anything yet for this query. Try to look for something else ...</div>;
    }
    
    if (this.state.hasMore && !this.state.loading && this.state.items.length !== 0) {
      updateButton = <div className="load-more" onClick={this.fetchData.bind(this, this.state.authorName, this.state.offset)}>
          <button type="button" className="btn btn-index">Upload more following</button>
        </div>;
    } else if (this.state.hasMore && this.state.loading && this.state.items.length == 0) {
      updateButton = <div className='loading-block'>
          <LoadingSpinner />
        </div>;
    }

    return (
      <div>
        <div className="posts-list clearfix type-2">
          {renderComponent}
        </div>
        {updateButton}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(FollowingComponent);
