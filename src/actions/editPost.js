import {getStore} from "../store/configureStore";

export function changeTitle(value) {
  return {
    type: 'EDIT_POST_CHANGE_TITLE',
    value
  }
}

export function addTag(value) {
  const tagsState = getStore().getState().editPost.tags;
  value = getValidTagsString(value);
  if (value.indexOf(' ') !== -1 || value.indexOf('\n') !== -1) {
    return {
      type: 'EDIT_POST_CHANGE_TAGS',
      value: getValidTagsString(tagsState.text + ' ' + value.trim()),
      current: ''
    }
  }
  return {
    type: 'EDIT_POST_CHANGE_TAGS',
    value: tagsState.text,
    current: value
  }
}

const MAX_TAG_LENGTH = 30;
const MAX_AMOUNT_TAGS = 20;

function getValidTagsString(str) {
  let result = str.replace(/^\s+/g, '');
  result = result.replace(/\s\s/g, ' ');
  result = result.replace(new RegExp(`((\\s[^\\s]+){${MAX_AMOUNT_TAGS - 1}}).*`), '$1');
  result = result.replace(new RegExp(`(([^\\s]{${MAX_TAG_LENGTH}})[^\\s]+).*`), '$2');
  return result;
}

export function changeDescription(value) {
  return {
    type: 'EDIT_POST_CHANGE_DESCRIPTION',
    value
  }
}

export function changeImage(image) {
  return {
    type: 'EDIT_POST_CHANGE_IMAGE',
    image
  }
}

export function removeTag(index) {
  const tagsString = getStore().getState().editPost.tags.text;
  let tagsList = tagsString.toLowerCase().split(' ');
  tagsList.splice(index, 1);
  return {
    type: 'EDIT_POST_REMOVE_TAG',
    value: tagsList.join(' ')
  }
}


