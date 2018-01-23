import {openModal} from './modal';

export function openPostModal(point, index, options) {
  return (dispatch) => {
    dispatch({
      type: 'INIT_POST_MODAL',
      options: {
        point,
        currentIndex: index,
      }
    });
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
