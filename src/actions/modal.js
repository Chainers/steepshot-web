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
  if (postModal.postOffset) {
    let alpha = window.pageYOffset - postModal.postOffset;
    let delta = Math.abs(alpha) < document.documentElement.clientHeight/2;
    if (delta) {
      return;
    }
    window.scrollTo(0, postModal.postOffset);
    // let step;
    // if (alpha > 1000 && alpha <= 2000) {
    //   step = 15
    // }
    // if (alpha < 2000) {
    //   step = 25
    // }
    // if (alpha >= 2000 && alpha < 6000) {
    //   step = 35
    // }
    // if (alpha >= 6000 && alpha < 110000) {
    //   step = 55
    // }
    // if (alpha >= 11000) {
    //   step = 75
    // }
    // let numberIterations = (Math.abs(alpha)/step);
    // let time = 1000/numberIterations;
    //
    // let top = window.pageYOffset;
    // let interval = setInterval( () => {
    //   if (window.pageYOffset > postModal.postOffset) {
    //     top -= step;
    //     window.scrollTo(0, top);
    //     if (window.pageYOffset <= postModal.postOffset) {
    //       dispatch(clearScroll(interval));
    //     }
    //   } else {
    //     top += step;
    //     window.scrollTo(0, top);
    //     if (window.pageYOffset >= postModal.postOffset) {
    //       dispatch(clearScroll(interval));
    //     }
    //   }
    // }, time);
  }
}

// function clearScroll(interval) {
//   return (dispatch) => {
//     clearTimeout(interval);
//     dispatch({
//       type: 'SET_POST_OFFSET',
//       postOffset: null
//     });
//   }
// }

export function closeAllModals() {
  return {
    type: 'CLOSE_ALL_MODALS'
  }
}


