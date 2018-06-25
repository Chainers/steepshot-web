import Constants from '../common/constants';

const initialState = {
  promoteAmount: Constants.SERVICES.BOTS.MIN_BID_VALUE,
  selectedToken: '',
  activeIndex: 0,
  infoLoading: false,
  inputError: '',
  selectError: ''
};

export default function promoteModal(state = initialState, action) {
  switch (action.type) {
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

    case 'SET_TIMER_STATE':
      return {
        ...state,
        leftTime: action.leftTime
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

    case 'ADD_ACTIVE_KEY':
      return {
        ...state,
        activeKey: action.key
      };

    default:
      return state;
  }
}
