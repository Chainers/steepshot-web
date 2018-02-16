import {getStore} from "../store/configureStore";
import constants from "../common/constants";
import utils from "../utils/utils";

export function addTag() {
  return (dispatch) => {
    const state = getStore().getState();
    const tagsState = state.editPost.tags;
    let newTag = state.textInput[constants.TEXT_INPUT_POINT.TAGS].text;
    newTag = getValidTagsString(newTag);
    if (utils.isEmptyString(newTag)) {
      return {
        type: 'EDIT_POST_ADD_EMPTY_TAG',
      }
    }
    dispatch({
      type: 'EDIT_POST_CHANGE_TAGS',
      value: getValidTagsString(tagsState.current + ' ' + newTag.trim()),
    });
    dispatch({
      type: 'TEXT_INPUT_SET_STATE',
      point: constants.TEXT_INPUT_POINT.TAGS,
      state: {
        focused: '',
        text: ''
      }
    })

  }
}

export function removeTag(index) {
  const tagsString = getStore().getState().editPost.tags.current;
  let tagsList = tagsString.toLowerCase().split(' ');
  tagsList.splice(index, 1);
  return {
    type: 'EDIT_POST_REMOVE_TAG',
    value: tagsList.join(' ')
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

export function changeImage(image) {
  return {
    type: 'EDIT_POST_CHANGE_IMAGE',
    image
  }
}

export function imageRotate() {
  let rotate = getStore().getState().editPost.image.rotate;
  rotate = (rotate + 90) % 360;
  return {
    type: 'EDIT_POST_ROTATE_IMAGE',
    rotate
  }
}

export function setImageContainerSize(width, height) {
  return {
    type: 'EDIT_POST_CHANGE_IMAGE_SIZE',
    width,
    height
  }
}


