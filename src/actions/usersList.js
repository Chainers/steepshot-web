import {getStore} from '../store/configureStore';
import {getUsersSearch} from "../services/posts";

export function initUsersList(options) {
  return {
    type: 'INIT_USERS_LIST',
    options
  };
}

export function clearUsersList(point) {
  return {
    type: 'CLEAR_USERS',
    point
  };
}

function getUsersListRequest(point) {
  return {
    type: 'GET_USERS_LIST_REQUEST',
    point
  };
}

function getUsersListSuccess(options, users) {
  return {
    type: 'GET_USERS_LIST_SUCCESS',
    options,
    users
  };
}


export function getUsersList(point, getUsers) {
  const LIMIT = 16;
  const statePoint = getStore().getState().usersList[point];
  if (statePoint.loading) {
    return {
      type: 'EMPTY_GET_USERS'
    }
  }
  if (!statePoint.hasMore) {
    return {
      type: 'ALL_USERS_LOADED',
      point
    }
  }
  return (dispatch) => {
    dispatch(getUsersListRequest(point));
    const requestOptions = {
      point: point.substr(0, point.indexOf('JSON_OPTIONS:')),
      params: {
        ...statePoint.options,
          offset: statePoint.offset,
          limit: LIMIT
      }
    };
    getUsers(requestOptions, true).then((response) => {
      let newUsers = response.results;
      let hasMore = response.results.length === LIMIT;
      if (statePoint.users.length !== 0) {
        newUsers = newUsers.slice(1, newUsers.length);
      }
      let authors = newUsers.map((user) => {
        return user.author;
      });

      let users = {};
      newUsers.forEach((user) => {
        users[user.author] = {
          ...user,
          togglingFollow: false
        };
      });

      let pointOptions = {
        point,
        hasMore,
        users: authors,
        offset: newUsers[newUsers.length - 1] ? newUsers[newUsers.length - 1].author : statePoint.offset,
      };

      dispatch(getUsersListSuccess(pointOptions, users));
    });
  };
}

function updateUserSuccess(updatedUser) {
  return {
    type: 'UPDATE_USER_SUCCESS',
    updatedUser
  }
}

function updateUserRequest(author) {
  return {
    type: 'UPDATE_USER_REQUEST',
    author
  }
}

export function updateUser(author) {
  return (dispatch) => {
    dispatch(updateUserRequest(author));

    const requestOptions = {
      point: 'user/search',
      params: Object.assign({}, {
        limit: 1,
        query: author
      })
    };
    getUsersSearch(requestOptions, true).then((response) => {
      let updatedUser = {[author]: {...response.results[0], togglingFollow: false}};
      dispatch(updateUserSuccess(updatedUser));
    });
  }
}
