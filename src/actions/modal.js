import {getStore} from '../store/configureStore';

export function openModal(index, options) {
  return {
    type: 'OPEN_MODAL',
    index,
    options
  }
}

export function setModalOptions(index, options) {
  return {
    type: 'SET_MODAL_OPTIONS',
    index,
    options
  }
}

export function closeModal(index) {
  let modal = getStore().getState().modals[index];
  let postModal = getStore().getState().postModal;
  if (!modal) {
    return {
      type: 'EMPTY_CLOSE_MODAL'
    }
  }
  return (dispatch) => {
    dispatch({
      type: 'WILL_CLOSE_MODAL',
      index
    });
    setTimeout(() => {dispatch({
      type: 'CLOSE_MODAL',
      index
    });
    }, 250);
    dispatch(scrollToLastSeen(postModal));
  }
}

function scrollToLastSeen(postModal) {
  return (dispatch) => {
    if (postModal.postOffset) {
      let alpha = window.pageYOffset - postModal.postOffset;
      let delta = Math.abs(alpha) < document.documentElement.clientHeight/2;
      if (delta) {
        return;
      }
      window.scrollTo(0, postModal.postOffset);
      dispatch({
        type: 'SET_POST_OFFSET',
        postOffset: null
      });
    }
  }
}

export function closeAllModals() {
  return {
    type: 'CLOSE_ALL_MODALS'
  }
}
