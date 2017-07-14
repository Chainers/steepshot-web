const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  postingKey: JSON.parse(localStorage.getItem('postingKey')) || null
};

export default function auth(state = initialState, action) {
  if (!state.hydrated) {
    state = Object.assign({}, initialState, state, { hydrated: true });
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
    case 'OAUTH_SUCCESS':
      return Object.assign({}, state, {
        user: action.user,
        postingKey: action.postingKey
      });
    case 'LOGOUT_SUCCESS':
      return {
        user: JSON.parse(localStorage.getItem('user')) || null,
        postingKey: JSON.parse(localStorage.getItem('postingKey')) || null
      };
    default:
      return state;
  }
}
