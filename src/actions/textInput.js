export function initTextInput(point, state) {
  return {
    type: 'INIT_TEXT_INPUT',
    point,
    state
  }
}

export function setTextInputState(point, state) {
  return {
    type: 'TEXT_INPUT_SET_STATE',
    point,
    state
  }
}
