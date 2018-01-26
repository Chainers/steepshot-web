import {openModal} from './modal';
import {getStore} from '../store/configureStore';
import {getPostsList} from './postsList';

export function initPostModal(point, index) {
  return {
    type: 'INIT_POST_MODAL',
    options: {
      point,
      currentIndex: index,
    }
  }
}

export function openPostModal(point, index, options) {
  return (dispatch) => {
    dispatch(initPostModal(point, index));
    dispatch(openModal(point, options));
  }
}

export function setPostModalOptions(options) {
  return (dispatch) => {
    dispatch({
      type: 'SET_POST_MODAL_OPTIONS',
      options
    });
  }
}

function swapPostModal(index) {
  return {
    type: 'SWAP_POST_MODAL',
    index
  }
}

export function nextPostModal(index) {
  let state = getStore().getState();
  let point = state.postModal.point;
  let postsList = state.postsList[point].postsIndices;
  let positionPost = postsList.indexOf(index);
  if (positionPost === postsList.length - 1) {
    return {
      type: 'THE_POST_IS_LAST'
    }
  }
  let newIndex = postsList[positionPost + 1];
  return (dispatch) => {
    dispatch(swapPostModal(newIndex))
  }
}

export function previousPostModal(index) {
  let state = getStore().getState();
  let point = state.postModal.point;
  let postsList = state.postsList[point].postsIndices;
  let positionPost = postsList.indexOf(index);
  if (positionPost === 0) {
    return {
      type: 'THE_POST_IS_FIRST'
    }
  }
  let newIndex = postsList[positionPost - 1];
  return (dispatch) => {
    if (positionPost === 0) {
      dispatch(getPostsList(point))
    }
    dispatch(swapPostModal(newIndex))
  }
}
