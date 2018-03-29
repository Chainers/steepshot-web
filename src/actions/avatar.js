export function setAvatarTip(param) {
  return {
    type: 'SET_AVATAR_TIP',
    isTip: param
  }
}
export function setAvatarTipTimeout(timeout) {
  return {
    type: 'SET_AVATAR_TIP_TIMEOUT',
    tipTimeout: timeout
  }
}

