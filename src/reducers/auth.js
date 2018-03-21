const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  postingKey: JSON.parse(localStorage.getItem('postingKey')) || null,
  settings: JSON.parse(localStorage.getItem('settings')) || null,
  avatar: JSON.parse(localStorage.getItem('avatar')) || null,
  voting_power: null,
  like_power: 100
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
        settings: action.settings,
        avatar: action.avatar,
        voting_power: action.voting_power
      };

    case 'LOGOUT_SUCCESS':
      return {
        ...state,
        user: JSON.parse(localStorage.getItem('user')) || null,
        postingKey: JSON.parse(localStorage.getItem('postingKey')) || null,
        settings: JSON.parse(localStorage.getItem('settings')) || null,
        avatar: JSON.parse(localStorage.getItem('avatar')) || null,
        voting_power: null,
        like_power: null
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: action.settings
      };
    case 'UPDATE_VOTING_POWER':
      return {
        ...state,
        voting_power: action.voting_power
      };
    case 'VOTING_POWER_TIMEOUT':
      return {
        ...state,
        vpTimeout: action.vpTimeout
      };
    case 'SET_LIKE_POWER':
      return {
        ...state,
        like_power: action.like_power
      };

    default:
      return state;
  }
}
