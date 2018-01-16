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

function getPostsListSuccess(pointOptions, posts) {
  return {
    type: 'GET_POSTS_LIST_SUCCESS',
    options: pointOptions,
    posts
  };
}

export function getPostsListAction(point) {
  return (dispatch) => {
    
    dispatch(getPostsListRequest(point));
    const state = getStore().getState();
    const statePoint = getStore().getState().postsList[point];
    const requestOptions = {
      point,
      param: Object.assign({}, {
          offset: statePoint.offset
        },
        statePoint.options)
    };
    getPosts(requestOptions, statePoint.cancelPrevious).then((response) => {
      let newPosts = statePoint.postsIndices.length ? response.results :
        response.results.slice(1);
      newPosts = removeDuplicate(statePoint.postsIndices, newPosts);
      let postsIndices = newPosts.map(post => {
        return post.url
      });
      let hasMore = !(statePoint.offset == response.offset);
      if (response.results.length == 1) hasMore = false;
      let pointOptions = {
        point,
        postsIndices,
        offset: response.offset,
        hasMore: hasMore,
        length: postsIndices.length,
      };
      
      let postsObject = {};
      let postsLength = newPosts.length;
      for (let i = 0; i < postsLength; i++) {
        let post = Object.assign({}, newPosts[i], {
          ui: {
            flagLoading: false,
          }
        });
        post.tags = (post.tags instanceof Array)
          ? post.tags
          : post.tags.split(',');
        postsObject[newPosts[i].url] = post;
      }
      newPosts = postsObject;
      
      dispatch(getPostsListSuccess(pointOptions, newPosts));
    });
  };
}

function removeDuplicate(posts, newPosts) {
  if (posts.length) {
    for (let i = 0; i < newPosts.length; i++) {
      if (posts[newPosts[i].url]) {
        newPosts.splice(i, 1);
        i--;
      }
    }
  }
  
  return newPosts;
}
