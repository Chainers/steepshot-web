import {getPosts} from './posts';
import {getStore} from '../store/configureStore';

export function initPostsList(options) {
  return {
    type: 'INIT_POSTS_LIST',
    options: options
  };
}

export function clearPosts() {
  return {
    type: 'CLEAR_POSTS'
  };
}

function getPostsListRequest(point) {
  return {
    type: 'GET_POSTS_LIST_REQUEST',
    point: point
  };
}

function getPostsListSuccess(pointOptions) {
  return {
    type: 'GET_POSTS_LIST_SUCCESS',
    options: pointOptions
  };
}

export function getPostsListAction(point) {
  return (dispatch) => {
    
    dispatch(getPostsListRequest(point));
    const state = getStore().getState().postsList[point];
    const requestOptions = {
      point,
      param: Object.assign({}, {
          offset: state.offset
        },
        state.options)
    };
    getPosts(requestOptions, state.cancelPrevious).then((response) => {
      let newPosts = state.posts.length ? response.results :
        response.results.slice(1);
      newPosts = removeDuplicate(state.posts, newPosts);
      let postsObject = {};
      let postsLength = newPosts.length;
      for (let i = 0; i < postsLength; i++) {
        postsObject[newPosts[i].url] = Object.assign({}, newPosts[i], {
          flagLoading: false
        })
      }
      newPosts = postsObject;
      let hasMore = !(state.offset == response.offset);
      if (response.results.length == 1) hasMore = false;
      let pointOptions = {
        point,
        posts: newPosts,
        offset: response.offset,
        hasMore: hasMore,
        length: postsLength,
      };
      dispatch(getPostsListSuccess(pointOptions));
    });
  };
}

function removeDuplicate(posts, newPosts) {
  for (let i = 0; i < newPosts.length; i++) {
    for(let j = 0; j < posts.length; j++) {
      if (newPosts[i].url === posts[j].url) {
        newPosts.splice(i, 1);
        i--;
      }
    }
  }
  return newPosts;
}
