import {getStore} from "../store/configureStore";
import constants from "../common/constants";
import utils from "../utils/utils";
import {getPostShaddow} from "../services/posts";
import Steem from "../libs/steem";
import {getHistory} from "../main";
import {clearTextInputState, setTextInputError, setTextInputState} from "./textInput";
import {getCreateWaitingTime} from "../services/users";

const getUserName = () => {
  return getStore().getState().auth.user;
};

function clearEditPost() {
  return dispatch => {
    dispatch({
      type: 'EDIT_POST_CLEAR'
    });
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TITLE));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.DESCRIPTION));
  };
}

export function addTag() {
  return (dispatch) => {
    const state = getStore().getState();
    const editPostState = state.editPost;
    let newTag = state.textInput[constants.TEXT_INPUT_POINT.TAGS].text;
    newTag = getValidTagsString(newTag);
    if (utils.isEmptyString(newTag)) {
      return emptyAction();
    }
    dispatch(editPostChangeTags(getValidTagsString(editPostState.tags + ' ' + newTag.trim())));

    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));

  }
}

export function removeTag(index) {
  const tagsString = getStore().getState().editPost.tags;
  let tagsList = tagsString.toLowerCase().split(' ');
  tagsList.splice(index, 1);
  return dispatch => {
    dispatch(editPostChangeTags(tagsList.join(' ')));
  }
}

export function changeImage(imageSrc, image, fileSize) {
  return dispatch => {
    if (!isValidImageSize(dispatch, image)) {
      return;
    }
    if (fileSize / 1000 / 1000 > 10) {
      dispatch(setEditPostImageError('Image should be less than 10 mb.'));
      return;
    }
    dispatch({
      type: 'EDIT_POST_CHANGE_IMAGE',
      image: imageSrc
    })
  }
}

export function imageRotate(image) {
  let rotate = getStore().getState().editPost.rotate;
  rotate = (rotate + 90) % 360;
  const imageSize = {
    width: image.naturalWidth,
    height: image.naturalHeight
  };
  if (rotate % 180) {
    const tmp = imageSize.width;
    imageSize.width = imageSize.height;
    imageSize.height = tmp;
  }
  return dispatch => {
    if (!isValidImageSize(dispatch, imageSize)) {
      return;
    }
    dispatch({
      type: 'EDIT_POST_ROTATE_IMAGE',
      rotate
    })
  }
}

export function setImageContainerSize(width, height) {
  return {
    type: 'EDIT_POST_CHANGE_IMAGE_SIZE',
    width,
    height
  }
}

export function editClearAll() {
  return dispatch => {
    dispatch({type: 'EDIT_POST_CLEAR_ALL'});
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TITLE));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.DESCRIPTION));
  }
}

export function imageNotFound() {
  return {
    type: 'EDIT_POST_IMAGE_NOT_FOUND'
  }
}

export function closeTimer() {
  return {
    type: 'EDIT_POST_CLOSE_TIMER'
  }
}

export function editPostClear() {
  const initDataEditPost = getStore().getState().editPost.initData;
  return dispatch => {
    dispatch(clearEditPost());
    dispatch(setTextInputState(constants.TEXT_INPUT_POINT.TITLE, {
      text: initDataEditPost.title || '',
      focused: initDataEditPost.title ? 'focused_tex-inp' : '',
      error: ''
    }));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));
    dispatch(setTextInputState(constants.TEXT_INPUT_POINT.DESCRIPTION, {
      text: initDataEditPost.description || '',
      focused: initDataEditPost.description ? 'focused_tex-inp' : '',
      error: ''
    }));
  }
}

export function setInitDataForEditPost(username, postId) {
  return (dispatch) => {
    if (!username || !postId) {
      dispatch(createNewPost())
    } else {
      getPostShaddow(username + '/' + postId).then((response) => {
        if (!response) {
          dispatch(createNewPost())
        } else {
          dispatch({
            type: 'EDIT_POST_SET_INIT_DATA',
            initData: {
              src: response.media[0].url,
              tags: response.tags.join(' '),
              title: response.title,
              description: response.description,
              dataResponse: response
            }
          })
        }
      });
    }
  }
}

export function editPost() {
  const postData = getStore().getState().editPost.initData.dataResponse;
  let {title, tags, description} = prepareData();

  return dispatch => {
    if (!isValidField(dispatch, title, 'no empty string')) {
      return;
    }

    dispatch(editPostRequest());
    Steem.editPost(title, tags, description, postData.url.split('/')[3], postData.category, postData.media[0])
      .then(() => {
        jqApp.pushMessage.open(
          'Post has been successfully updated. If you don\'t see the updated post in your profile, '
          + 'please give it a few minutes to sync from the blockchain');
        setTimeout(() => {
          dispatch(editPostSuccess());
          getHistory().push(`/@${getUserName()}`);
        }, 1700);
      }).catch(error => {
      dispatch(editPostReject(error));
      jqApp.pushMessage.open(error.message);
    })
  }
}

export function createPost() {
  let {title, tags, description, photoSrc, rotate} = prepareData();

  return dispatch => {
    if (!isValidField(dispatch, title, photoSrc)) {
      return;
    }
    checkTimeAfterUpdatedLastPost()
      .then(() => {
      dispatch(editPostRequest());
      const image = new Image();
      image.src = photoSrc;
      image.onload = () => {
        const canvas = getCanvasWithImage(image, rotate);
        fetch(canvas.toDataURL('image/jpeg', 0.94)).then(res => res.blob())
          .then(blob => {
            return Steem.createPost(tags, title, description, blob)
          })
          .then(() => {
            jqApp.pushMessage.open(
              'Post has been successfully created. If you don\'t see the post in your profile, '
              + 'please give it a few minutes to sync from the blockchain');
              dispatch(editPostSuccess());
              getHistory().push(`/@${getUserName()}`);
            })
            .catch(error => {
              dispatch(editPostReject(error));
              jqApp.pushMessage.open(error.message);
            });
        }
      })
      .catch(error => {
        dispatch({
          type: 'EDIT_POST_SET_WAITING_TIME_SUCCESS',
          waitingTime: error
        })
      });
  }
}

function prepareData() {
  const state = getStore().getState();
  const editPostState = state.editPost;
  const textInputStates = state.textInput;

  const title = textInputStates.title.text;
  const description = textInputStates.description.text;
  const tags = getValidTagsString(editPostState.tags);
  const photoSrc = editPostState.src;
  const rotate = editPostState.rotate;

  return {title, description, tags, photoSrc, rotate};
}


const MAX_TAG_LENGTH = 30;
const MAX_AMOUNT_TAGS = 19;

function getValidTagsString(str) {
  let result = str.replace(/^\s+/g, '');
  result = result.replace(/\s\s/g, ' ');
  result = result.replace(/[^\w\s]+/g, '');
  result = result.replace(new RegExp(`((\\s[^\\s]+){${MAX_AMOUNT_TAGS - 1}}).*`), '$1');
  result = result.replace(new RegExp(`(([^\\s]{${MAX_TAG_LENGTH}})[^\\s]+).*`), '$2');
  return result;
}


function emptyAction() {
  return {
    type: 'EDIT_POST_EMPTY_ACTION',
  }
}

function editPostChangeTags(tagsString) {
  return {
    type: 'EDIT_POST_CHANGE_TAGS',
    value: tagsString,
  }
}

function createNewPost() {
  return dispatch => {
    getCreateWaitingTime(getUserName())
      .then(response => {
        dispatch({
          type: 'EDIT_POST_SET_WAITING_TIME_SUCCESS',
          waitingTime: response['waiting_time']
        })
      })
      .catch(error => {
        dispatch({
          type: 'EDIT_POST_SET_WAITING_TIME_ERROR',
          data: {
            error
          }
        })
      });

    dispatch({type: 'EDIT_POST_CREATE_NEW'});
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TITLE));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.DESCRIPTION));
  };
}

function editPostSuccess() {
  return {
    type: 'EDIT_POST_SUCCESS'
  };
}

function editPostReject(error) {
  return {
    type: 'EDIT_POST_REJECT',
    error
  };
}

function checkTimeAfterUpdatedLastPost() {
  return new Promise((resolve, reject) => {
    getCreateWaitingTime(getUserName())
      .then(response => {
        const waitingTime = response['waiting_time'];
        if (waitingTime !== 0) {
          reject(waitingTime);
        } else {
          resolve();
        }
      })
      .catch(() => {
        resolve();
      });
  })
}

function getCanvasWithImage(image, rotate) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (rotate % 180) {
    canvas.width = image.naturalHeight;
    canvas.height = image.naturalWidth;
  } else {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }

  if (rotate === 90) {
    ctx.translate(canvas.width, 0);
  } else if (rotate === 180) {
    ctx.translate(canvas.width, canvas.height);
  } else if (rotate === 270) {
    ctx.translate(0, canvas.height);
  }

  ctx.rotate(rotate * Math.PI / 180);
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  return canvas;
}

function isValidImageSize(dispatch, imageSize) {
  if (imageSize.width < constants.IMAGE.MIN_WIDTH
    || imageSize.height < constants.IMAGE.MIN_HEIGHT) {
    const message = 'Photo size should be more than ' + constants.IMAGE.MIN_WIDTH + 'x' + constants.IMAGE.MIN_HEIGHT
      + '. Your photo has ' + imageSize.width + 'x' + imageSize.height + '.';
    dispatch(setEditPostImageError(message));
    return false;
  }
  return true;
}

function isValidField(dispatch, title, photoSrc) {
  let isValid = true;
  if (utils.isEmptyString(title)) {
    dispatch(setTextInputError(constants.TEXT_INPUT_POINT.TITLE, 'Title is required'));
    isValid = false;
  }
  if (utils.isEmptyString(photoSrc)) {
    dispatch(setEditPostImageError('Photo is required'));
    isValid = false;
  }
  return isValid;
}

export function setEditPostImageError(message) {
  return {
    type: 'EDIT_POST_SET_IMAGE_ERROR',
    message
  };
}

function editPostRequest() {
  return {
    type: 'EDIT_POST_REQUEST'
  }
}
