const initialState = {
  image: {
    file: '',
    src: '',
    error: ''
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
          text: action.value,
          current: action.current
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
          text: action.value
        }
      };
    case 'EDIT_POST_CHANGE_IMAGE':
      return {
        ...state,
        image: {
          ...state.image,
          src: action.image
        }
      };

    default:
      return state;
  }
}
