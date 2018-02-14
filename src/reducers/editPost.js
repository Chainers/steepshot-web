const initialState = {
  image: {
    file: '',
    url: '',
    error: ''
  },
  tags: {
    text: '',
    list: [],
    error: ''
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
          ...state.tags, text: action.value
        }
      };
    case 'EDIT_POST_CHANGE_DESCRIPTION':
      return {
        ...state, description: action.value
      };

    default:
      return state;
  }
}
