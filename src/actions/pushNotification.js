export function openPushNot(index, pushNotBody) {
  return (dispatch) => {
    dispatch({
      type: 'OPEN_PUSH_NOTIFICATION',
      index,
      pushNotBody
    });
  }
}

export function closePushNot(index) {
  return {
    type: 'CLOSE_PUSH_NOTIFICATION',
    index
  }
}

export function setPushNotTimeout(index, pnTimeout) {
  return {
    type: 'SET_PUSH_NOTIFICATION_TIMEOUT',
    index,
    pnTimeout
  }
}