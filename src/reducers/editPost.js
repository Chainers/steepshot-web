const initialState = {
  initData: {
    src: '',
    tags: '',
    title: '',
    description: ''
  },
  imageError: '',
  src: '',
  rotate: 0,
  tags: '',
  loading: false
};

export default function editPost(state = initialState, action) {
  switch (action.type) {

    case 'EDIT_POST_CHANGE_TAGS':
      return {
        ...state,
        tags: action.value
      };

    case 'EDIT_POST_CHANGE_IMAGE':
      return {
        ...state,
        src: action.image,
        rotate: 0,
        imageError: ''
      };

    case 'EDIT_POST_ROTATE_IMAGE':
      return {
        ...state,
        rotate: action.rotate,
        imageError: ''
      };

    case 'EDIT_POST_CHANGE_IMAGE_SIZE':
      return {
        ...state,
        height: action.height,
        width: action.width
      };

    case 'EDIT_POST_SET_INIT_DATA':
      return {
        ...initialState, initData: {
          ...action.initData
        },
        src: action.initData.src,
        tags: action.initData.tags,
        loading: false
      };

    case 'EDIT_POST_CREATE_POST_REQUEST':
      return {
        ...state,
        loading: true
      };

    case 'EDIT_POST_CREATE_POST_SUCCESS':
      return {
        ...state,
        loading: false
      };

    case 'EDIT_POST_CLEAR':
      return {
        ...initialState,
        initData: {
          ...state.initData
        },
        src: state.initData.src,
        tags: state.initData.tags,
      };

    case 'EDIT_POST_SET_IMAGE_ERROR':
      return {
        ...state,
        imageError: action.message
      };
    default:
      return state;
  }
}
