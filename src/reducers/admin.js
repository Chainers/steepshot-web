const initialState = {
  users: {},
	isReceived: false
};

export default function admin(state = initialState, action) {
  switch (action.type) {
    case 'GET_USERS_SUCCESS':
      return Object.assign({}, state, {
        users: action.users,
        isReceived: true
      });
    case 'GET_USERS_FAILURE':
      return Object.assign({}, state, {
        isReceived: false
      });
    default:
      return state;
  }
}
