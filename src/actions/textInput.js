import constants from "../common/constants";

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

export function setTextInputError(point, message) {
  return {
    type: 'TEXT_INPUT_SET_ERROR',
    point,
    message
  }
}

export function clearTextInputState(point) {
  return setTextInputState(point, {focused: '', text: '', error: ''});
}
