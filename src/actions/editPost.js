export function changeTitle(value) {
  return {
    type: 'EDIT_POST_CHANGE_TITLE',
    value
  }
}

export function changeTags(value) {
  return {
    type: 'EDIT_POST_CHANGE_TAGS',
    value: getValidTagsString(value)
  }
}

const MAX_TAG_LENGTH = 30;
const MAX_AMOUNT_TAGS = 20;

function getValidTagsString(str) {
  let result = str.replace(/^\s+/g, '');
  result = result.replace(/\s\s/g, ' ');
  result = result.replace(new RegExp(`((\\s[^\\s]+){${MAX_AMOUNT_TAGS  - 1}}).*`), '$1');
  result = result.replace(new RegExp(`(([^\\s]{${MAX_TAG_LENGTH}})[^\\s]+).*`), '$2');
  return result;
}

function replace(str, regExp) {
  return str.replace(new RegExp(regExp))
}

export function changeDescription(value) {
  return {
    type: 'EDIT_POST_CHANGE_DESCRIPTION',
    value
  }
}
