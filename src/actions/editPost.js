import {getStore} from "../store/configureStore";
import constants from "../common/constants";
import utils from "../utils/utils";
import {getPosts, getPostShaddow} from "../services/posts";
import Steem from "../libs/steem";
import {getHistory} from "../main";
import {clearTextInputState, setTextInputError, setTextInputState} from "./textInput";

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

export function changeImage(imageSrc, image) {
  return dispatch => {
    if (!isValidImageSize(dispatch, image)) {
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

export function editPostClear() {
  const initDataEditPost = getStore().getState().editPost.initData;
  return dispatch => {
    dispatch(clearEditPost());
    dispatch(setTextInputState(constants.TEXT_INPUT_POINT.TITLE, {
      text: initDataEditPost.title,
      focused: initDataEditPost.title ? 'focused_tex-inp' : '',
      error: ''
    }));
    dispatch(clearTextInputState(constants.TEXT_INPUT_POINT.TAGS));
    dispatch(setTextInputState(constants.TEXT_INPUT_POINT.DESCRIPTION, {
      text: initDataEditPost.description,
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
              description: response.description
            }
          })
        }
      });
    }
  }
}

const MIN_MINUTES_FOR_CREATING_NEW_POST = 5;

export function createPost() {
  const state = getStore().getState();
  const editPostState = state.editPost;
  const textInputStates = state.textInput;
  const title = textInputStates.title.text;
  const description = textInputStates.description.text;
  const tags = getValidTagsString(editPostState.tags);
  const photoSrc = editPostState.src;
  const rotate = editPostState.rotate;
  const auth = state.auth;

  return (dispatch) => {
    if (!isValidField(dispatch, title, photoSrc)) {
      return;
    }
    getMinutesFromCreatingLastPost(auth.user).then(response => {
      if (response < MIN_MINUTES_FOR_CREATING_NEW_POST) {
        jqApp.pushMessage.open("You can only create posts 5 minutes after the previous one.");
        return;
      }
      dispatch({
        type: 'EDIT_POST_CREATE_POST_REQUEST'
      });
      const image = new Image();
      image.src = photoSrc;

      image.onload = () => {
        const canvas = getCanvasWithImage(image, rotate);

        fetch(canvas.toDataURL()).then(res => res.blob())
          .then(blob => {
            return Steem.createPost(tags.split(' '), title, description, blob)
          })
          .then(() => {
            jqApp.pushMessage.open(
              'Post has been successfully created. If you don\'t see the post in your profile, '
              + 'please give it a few minutes to sync from the blockchain');
            setTimeout(() => {
              dispatch(clearEditPost());
              dispatch(createPostSuccess());
              getHistory().push(`/@${auth.user}`);
            }, 1700);

          })
          .catch(error => {
            dispatch(createPostReject(error));
            jqApp.pushMessage.open(error.message);
          });
      }
    });
  }
}


const MAX_TAG_LENGTH = 30;
const MAX_AMOUNT_TAGS = 19;

function getValidTagsString(str) {
  let result = str.replace(/^\s+/g, '');
  result = result.replace(/\s\s/g, ' ');
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

function clearEditPost() {
  return {
    type: 'EDIT_POST_CLEAR'
  };
}

function createNewPost() {
  return {
    type: 'EDIT_POST_CREATE_NEW'
  };
}

function createPostSuccess() {
  return {
    type: 'EDIT_POST_CREATE_POST_SUCCESS'
  };
}
function createPostReject(error) {
  return {
    type: 'EDIT_POST_CREATE_POST_REJECT',
    error
  };
}

function getMinutesFromCreatingLastPost(user) {
  return new Promise((resolve) => {
    const requestOptions = {
      point: `user/${user}/posts`,
      params: {
        show_nsfw: 0,
        show_low_rated: 0,
        limit: 1
      }
    };
    getPosts(requestOptions, false).then((response) => {
      if (!response.count) {
        resolve(MIN_MINUTES_FOR_CREATING_NEW_POST);
      } else {
        resolve((new Date().getTime() - new Date(response.results[0].created).getTime()) / 1000 / 60);
      }
    });
  })
}

function getCanvasWithImage(image, rotate) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (rotate % 180) {
    canvas.width = image.naturalHeight;
    canvas.height = image.naturalWidth;
    ctx.translate(canvas.width, 0);
  } else {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }

  ctx.rotate(rotate * Math.PI / 180);
  ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
  return canvas;
}

function isValidImageSize(dispatch, imageSize) {
  if (imageSize.width < constants.IMAGE.MIN_WIDTH
    || imageSize.height < constants.IMAGE.MIN_HEIGHT) {
    const message = 'Photo size should be more then ' + constants.IMAGE.MIN_WIDTH + 'x' + constants.IMAGE.MIN_HEIGHT
      + '. Yours photo has ' + imageSize.width + 'x' + imageSize.height + '.';
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

function setEditPostImageError(message) {
  return {
    type: 'EDIT_POST_SET_IMAGE_ERROR',
    message
  };
}
