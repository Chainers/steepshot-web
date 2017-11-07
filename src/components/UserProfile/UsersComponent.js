import React from 'react';
import LocalizedStrings from '../Localization/index.js';
import { connect } from 'react-redux';
import LoadingSpinner from '../LoadingSpinner';
import UserItem from './userItem';
import Constants from '../../common/constants';

class UsersComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : true,
      loadingMore : false,
      hasMore : true,
      items : [],
      offset : null,
      point : this.props.point,
      getUsers : this.props.getUsers,
      usersLabel : this.props.usersLabel,
      wrapperModifier : this.props.wrapperModifier,
      options : this.props.options
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
        getUsers : nextProps.getUsers,
        usersLabel : nextProps.usersLabel
    });
    this.fetchData();
  }

  fetchData() {
    if (this.state.items.length > 0)
    this.setState({
        loadingMore: true
    });

    const options = {
      point : this.state.point,
      params : Object.assign({}, {
        offset : this.state.offset
      },
      this.state.options)
    };

    this.state.getUsers(options, true).then((response) => {
        this.state.items.pop();
        let newItems = this.state.items.concat(response.results);
        let hasMore = !(this.state.offset == response.offset);    
        this.setState({ 
            items: newItems, 
            offset: response.offset,
            hasMore: hasMore,
            loadingMore: false,
            loading : false
        });
    });
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
      this.state.items.map((user, index) => {
        items.push(
          <UserItem
            key={index}
            item={user}
            history={this.props.history} 
          />
        );
      })
      return items;
    }
  }

  renderMainLoader() {
    if (this.state.loading) return <LoadingSpinner />;
    return null;
  }

  renderUploadMore() {
    if (this.state.loading || this.state.items.length == 0) return null;
    if (this.state.loadingMore) {
      return (
        <div className="position--relative">
          <LoadingSpinner />
        </div>
      )
    } else {
      return (
        <div className="load-more" onClick={this.fetchData.bind(this)}>
          <button type="button" className="btn btn-index">Upload more {this.state.usersLabel}</button>
        </div>
      )
    }
  }

  render() {
    return (
        <div>
          <div className={this.state.wrapperModifier}>
            {this.renderItems()}
          </div>
          {this.renderUploadMore()}
          {this.renderMainLoader()}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(UsersComponent);
