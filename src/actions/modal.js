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
  console.log(getStore().getState().modals);
  let modal = getStore().getState().modals[index];
  if (!modal) {
    return {
      type: 'EMPTY_ACTION'
    }
  }
  return (dispatch) => {
    modal.callBeforeClosed();
    dispatch({
      type: 'CLOSE_MODAL',
      index
    });
    modal.callAfterClosed();
  }
}
