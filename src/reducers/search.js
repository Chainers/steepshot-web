import constants from '../common/constants';
const initialState = {
  value: '',
  text: '',
  category: constants.CATEGORIES.user
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'SET_SEARCH_VALUE':
      return {...state, 
        value: action.value,
        text: action.text,
        category: action.category
      };
    default:
      return state;
  }
}
