import React from 'react';
import {connect} from 'react-redux';
import {debounce} from 'lodash';
import Constants from '../../common/constants';
import InfiniteScroll from 'react-infinite-scroller';
import LoadingSpinner from '../LoadingSpinner';
import {clearUsersList, getUsersList, initUsersList} from '../../actions/usersList';
import {documentTitle} from '../DocumentTitle';
import User from "./User/User";

class UsersList extends React.Component {
  static defaultProps = {
    isComponentVisible: true,
    useScrollView: false
  };

  constructor(props) {
    super(props);
    this.props.clearUsersList(this.props.point);
    let usersListOptions = UsersList.userListOptions(this.props);
    this.props.initUsersList(usersListOptions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.options && (nextProps.options.query !== this.props.options.query)) {
      let usersListOptions = UsersList.userListOptions(nextProps);
      this.props.initUsersList(usersListOptions);
      this.props.getUsersList(this.props.point, this.props.getUsers);
    }
  }

  static userListOptions(props) {
    return {
      point: props.point,
      loading: false,
      hasMore: true,
      users: [],
      offset: null,
      options: props.options,
      loader: true
    };
  }

  getUsersList() {
    if (this.props.isComponentVisible) {
      this.props.getUsersList(this.props.point, this.props.getUsers);
    }
  }

  componentDidMount() {
    this.props.getUsersList(this.props.point, this.props.getUsers);
    documentTitle();
  }

  renderUsers() {
    if (this.props.loader) {
      return (
        <span/>
      )
    }
    if (!this.props.users || !this.props.users[0]) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>
      );
    }
    let users = [];
    this.props.users.map((user, index) => {
      users.push(
        <User
          key={index}
          index={this.props.users[index]}
        />,
      );
    });
    return users;
  }

  render() {
    return (
      <InfiniteScroll
        pageStart={0}
        initialLoad={false}
        loadMore={debounce(this.getUsersList.bind(this),
          Constants.ENDLESS_SCROLL.DEBOUNCE)}
        hasMore={this.props.isComponentVisible && this.props.hasMore}
        loader={<div className='spinner_use-lis'><LoadingSpinner/></div>}
        threshold={Constants.ENDLESS_SCROLL.OFFSET}
        useWindow={!this.props.useScrollView}
        useCapture={this.props.useScrollView}
      >
        <div className={'body_use-lis ' + this.props.className}>
          {this.renderUsers()}
          {this.props.children}
        </div>
      </InfiniteScroll>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.usersList[props.point],
    options: props.options
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    initUsersList: (options) => {
      dispatch(initUsersList(options));
    },
    getUsersList: (point, func) => {
      dispatch(getUsersList(point, func));
    },
    clearUsersList: (point) => {
      dispatch(clearUsersList(point));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersList);
