export function openPushNot(index, pushNotBody) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(closePushNot(index));
    }, 3000);
    dispatch({
      type: 'OPEN_PUSH_NOTIFICATION',
      index,
      pushNotBody
    });
  }
}

function closePushNot(index) {
  return {
    type: 'CLOSE_PUSH_NOTIFICATION',
    index
  }
}