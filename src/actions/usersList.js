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

export function setUsersSearchValue(point, searchValue) {
  return {
    type: 'SET_USERS_SEARCH_VALUE',
    point,
    searchValue
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
  const statePoint = getStore().getState().usersList[point];
  if (statePoint.loading) {
    return {
      type: 'EMPTY_ACTION'
    }
  }
  if (!statePoint.hasMore) {
    return {
      type: 'ALL_USERS_LOADED'
    }
  }
  return (dispatch) => {
    dispatch(getUsersListRequest(point));
    const requestOptions = {
      point,
      params: Object.assign({}, {
          offset: statePoint.offset,
        },
        statePoint.options)
    };
    getUsers(requestOptions, true).then((response) => {
      let newUsers = response.results;
      if (statePoint.users.length !== 0) {
        newUsers = newUsers.slice(1, newUsers.length);
      }
      let hasMore = statePoint.offset !== response.offset;

      let pointOptions = {
        point,
        hasMore,
        users: newUsers,
        offset: response.offset,
      };

      dispatch(getUsersListSuccess(pointOptions));
    });
  };
}
