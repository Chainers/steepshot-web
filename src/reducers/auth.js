const initialState = {
  token: null,
  user: JSON.parse(localStorage.getItem('user')) || {},
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
        token: action.token,
        user: action.user,
        postingKey: action.postingKey
      });
    case 'LOGOUT_SUCCESS':
      return {
        token: null,
        user: JSON.parse(localStorage.getItem('user')) || {},
        postingKey: JSON.parse(localStorage.getItem('postingKey')) || null
      };
    default:
      return state;
  }
}
