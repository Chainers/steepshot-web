import {getPostShaddow} from './posts';

export function setDefaultAvatar(postIndex) {
  return {
    type: 'SET_DEFAULT_AVATAR',
    index: postIndex
  }
}


export function addPosts(posts) {
  return {
    type: 'ADD_POSTS',
    posts
  }
}

export function updatePost(postIndex) {
  return (dispatch) => {
    const urlObject = postIndex.split('/');
    getPostShaddow(urlObject[urlObject.length - 2] + '/' +
      urlObject[urlObject.length - 1]).then((result) => {
      dispatch({
        type: 'UPDATE_POST',
        post: result
      })
    });
  }
}



