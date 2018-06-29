import Constants from '../common/constants';

const initialState = {
  promoteAmount: Constants.SERVICES.BOTS.MIN_BID_VALUE,
  selectedToken: '',
  inputError: '',
  selectError: '',
  activeKey: '',
  activeIndex: 0,
  infoLoading: false,
  showActiveKey: false,
};

export default function promoteModal(state = initialState, action) {
  switch (action.type) {
    case 'ADD_POST_INDEX' :
      return {
        ...state,
        postIndex: action.postIndex
      };

    case 'SET_PROMOTE_VALUE':
      return {
        ...state,
        promoteAmount: action.value
      };

    case 'SET_SELECTED_INDEX':
      return {
        ...state,
        selectedToken: action.token,
        activeIndex: action.index
      };

    case 'GET_AUTH_USER_INFO_SUCCESS':
      return {
        ...state,
        userInfo: action.result
      };

    case 'SET_AUTH_USER_INFO_LOADING':
      return {
        ...state,
        infoLoading: action.loading
      };

    case 'SET_PROMOTE_INPUT_ERROR':
      return {
        ...state,
        inputError: action.error
      };

    case 'SET_SELECT_ERROR':
      return {
        ...state,
        selectError: action.error
      };

    case 'SET_ACTIVE_KEY_ERROR':
      return {
        ...state,
        activeKeyError: action.activeKeyError
      };

    case 'SET_BOT_REQUEST':
      return {
        ...state,
        searchingBot: action.state
      };

    case 'SET_BID_REQUEST':
      return {
        ...state,
        sendingBid: action.state
      };

    case 'ADD_BOT':
      return {
        ...state,
        suitableBot: action.bot
      };

    case 'SET_ACTIVE_KEY':
      return {
        ...state,
        activeKey: action.key
      };

    case 'SET_ACTIVE_KEY_INPUT_SECURITY':
      return {
        ...state,
        showActiveKey: action.state
      };

    case 'GET_AUTH_USER_INFO_ERROR':
      return {
        ...state,
        userInfoErrorStatus: action.error
      };

    case 'SET_RED_TIMER':
      return {
        ...state,
        redTimer: action.param
      };

    case 'SET_BLOCKED_TIMER':
      return {
        ...state,
        blockedTimer: action.param
      };

    case 'LOGOUT_SUCCESS':
      return initialState;

    default:
      return state;
  }
}
