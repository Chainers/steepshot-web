export function setLikesFlagsListBodyHeight(preferredBodyHeight, fullBodyHeight) {
  return {
    type: 'SET_LIKES_LIST_BODY_HEIGHT',
    preferredBodyHeight,
    fullBodyHeight
  }
}

export function clearBodyHeight() {
  return {
    type: 'CLEAR_BODY_HEIGHT'
  }
}
