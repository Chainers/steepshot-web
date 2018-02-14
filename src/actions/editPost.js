export function changeTitle(value) {
  return {
    type: 'EDIT_POST_CHANGE_TITLE',
    value
  }
}

export function changeTags(value) {
  return {
    type: 'EDIT_POST_CHANGE_TAGS',
    value
  }
}

export function changeDescription(value) {
  return {
    type: 'EDIT_POST_CHANGE_DESCRIPTION',
    value
  }
}
