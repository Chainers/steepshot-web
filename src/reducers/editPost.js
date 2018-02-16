const initialState = {
  image: {
    file: '',
    src: '',
    error: '',
    rotate: 0
  },
  tags: {
    text: '',
    list: [],
    error: '',
    current: ''
  },
  title: {
    text: '',
    error: ''
  },
  description: '',
  loader: false
};

export default function editPost(state = initialState, action) {
  switch (action.type) {
    case 'EDIT_POST_CHANGE_TITLE':
      return {
        ...state, title: {
          ...state.title, text: action.value
        }
      };
    case 'EDIT_POST_CHANGE_TAGS':
      return {
        ...state, tags: {
          ...state.tags,
          current: action.value
        }
      };
    case 'EDIT_POST_CHANGE_DESCRIPTION':
      return {
        ...state, description: action.value
      };
    case 'EDIT_POST_REMOVE_TAG':
      return {
        ...state, tags: {
          ...state.tags,
          current: action.value
        }
      };
    case 'EDIT_POST_CHANGE_IMAGE':
      return {
        ...state,
        image: {
          ...state.image,
          src: action.image,
          rotate: 0
        }
      };
    case 'EDIT_POST_ROTATE_IMAGE':
      return {
        ...state,
        image: {
          ...state.image,
          rotate: action.rotate
        }
      };
    case 'EDIT_POST_CHANGE_IMAGE_SIZE':
      return {
        ...state,
        image: {
          ...state.image,
          height: action.height,
          width: action.width
        }
      };

    default:
      return state;
  }
}
