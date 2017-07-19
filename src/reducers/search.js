import constants from '../common/constants';
const initialState = {
  value: '',
  category: constants.CATEGORIES.user
};

export default function search(state = initialState, action) {
  switch (action.type) {
    case 'SET_VALUE':
      return Object.assign({}, state, {
        value: action.value,
        category: action.category
      });
    default:
      return state;
  }
}
