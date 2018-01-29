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
  if (!modal) {
    return {
      type: 'EMPTY_ACTION'
    }
  }
  return (dispatch) => {
    modal.callBeforeClosed();
    dispatch({
      type: 'WILL_CLOSE_MODAL',
      index
    });
    setTimeout(() => {dispatch({
      type: 'CLOSE_MODAL',
      index
    });}, 250);
    modal.callAfterClosed();
  }
}

export function closeAllModals() {
  return {
    type: 'CLOSE_ALL_MODALS'
  }
}


