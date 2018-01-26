import Constants from '../common/constants';
import {getPosts} from './posts';
import _ from 'lodash';

export function setActiveIndex(index) {
  return {
    type: 'SET_ACTIVE_INDEX',
    index
  }
}

export function getIgnoredPostsList(searchValue) {
  return dispatch => {
    dispatch({
      type: 'GET_IGNORED_POSTS_REQUEST'
    });
    const options = {
      point: insertCategory(
        Constants.POSTS_FILTERS.POSTS_HOT.point,
        searchValue),
      params: Object.assign({}, {
        offset: null,
      }, {limit: 4}),
    };
    getPosts(options, false).then(result => {
      dispatch({
        type: 'GET_IGNORED_POSTS_SUCCESS',
        ignored: _.map(result.results, 'url'),
        showResults: true,
      });
    });
  }
}


export function insertCategory(point, category) {
  if (category == undefined) return point;
  let path = point.split('/');
  return `${path[0]}/${category}/${path[1]}`;
}
