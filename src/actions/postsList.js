import {getPosts} from './posts';
import {getStore} from '../store/configureStore';
import {addPosts} from './post';

export function initPostsList(options) {
  return {
    type: 'INIT_POSTS_LIST',
    options
  };
}

export function clearPostsList() {
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

export function getPostsList(point) {
  const statePoint = getStore().getState().postsList[point];
  if (statePoint.loading) {
    return {
      type: 'EMPTY_ACTION'
    }
  }
  return (dispatch) => {
    dispatch(getPostsListRequest(point));
    let userSettings = getStore().getState().auth.settings;
    const requestOptions = {
      point,
      params: Object.assign({}, {
          offset: statePoint.offset,
          show_nsfw: userSettings ? userSettings.show_nsfw : false,
          show_low_rated: userSettings ? userSettings.show_low_rated : false
        },
        statePoint.options)
    };
    getPosts(requestOptions, statePoint.cancelPrevious).then((response) => {
      let newPosts = response.results;
      newPosts = removeDuplicate(newPosts);
      newPosts = removeOldDuplicate(statePoint.postsIndices, newPosts);

      let postsIndices = newPosts.map(post => {
        return post.url
      });
      let hasMore = !(statePoint.offset == response.offset);
      if (statePoint.maxPosts <=
        postsIndices.length + statePoint.postsIndices.length) {
        postsIndices = postsIndices
          .slice(0, statePoint.maxPosts - statePoint.postsIndices.length);
        hasMore = false;
      }
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
          flagLoading: false,
          voteLoading: false,
          postDeleting: false
        });
        post.tags = (post.tags instanceof Array)
          ? post.tags
          : post.tags.split(',');
        postsObject[newPosts[i].url] = post;
      }
      newPosts = postsObject;
      dispatch(addPosts(newPosts));
      dispatch(getPostsListSuccess(pointOptions));
    });
  };
}

function removeOldDuplicate(posts, newPosts) {
  if (posts.length) {
    for (let i = 0; i < newPosts.length; i++) {
      for (let j = 0; j < posts.length; j++) {
        if (posts[j] === newPosts[i].url) {
          newPosts.splice(i, 1);
          i--;
        }
      }
    }
  }
  return newPosts;
}

function removeDuplicate(posts) {
  if (posts.length) {
    for (let i = 0; i < posts.length - 1; i++) {
      for (let j = i + 1; j < posts.length; j++) {
        if (posts[j].url === posts[i].url) {
          posts.splice(j, 1);
          j--;
        }
      }
    }
  }
  return posts;
}
