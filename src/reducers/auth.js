const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  postingKey: JSON.parse(localStorage.getItem('postingKey')) || null,
  settings: JSON.parse(localStorage.getItem('settings')) || null,
  avatar: JSON.parse(localStorage.getItem('avatar')) || null
};

export default function auth(state = initialState, action) {
  if (!state.hydrated) {
    state = {...initialState, state, hydrated: true};
  }
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'SIGNUP_SUCCESS':
    case 'OAUTH_SUCCESS':
      return {
        ...state,
        user: action.user,
        postingKey: action.postingKey,
        settings: action.settins,
        avatar: action.avatar
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: JSON.parse(localStorage.getItem('user')) || null,
        postingKey: JSON.parse(localStorage.getItem('postingKey')) || null,
        settings: JSON.parse(localStorage.getItem('settings')) || null,
        avatar: JSON.parse(localStorage.getItem('avatar')) || null
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.settings
      };

    default:
      return state;
  }
}
