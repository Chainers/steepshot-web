import {getStore} from '../store/configureStore';

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

function getUsersListSuccess(options) {
  return {
    type: 'GET_USERS_LIST_SUCCESS',
    options
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
      point,
      params: Object.assign({}, {
          offset: statePoint.offset,
          limit: LIMIT
      },
      statePoint.options)
    };
    getUsers(requestOptions, true).then((response) => {
      let newUsers = response.results;
      if (statePoint.users.length !== 0) {
        newUsers = newUsers.slice(1, newUsers.length);
      }
      let hasMore = response.results.length + statePoint.users.length !== response.count;
      let pointOptions = {
        point,
        hasMore,
        users: newUsers ? newUsers : [],
        offset: newUsers[newUsers.length - 1] ? newUsers[newUsers.length - 1].author : statePoint.offset,
      };

      dispatch(getUsersListSuccess(pointOptions));
    });
  };
}
