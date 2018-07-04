const initialState = {
  loading: false,
  transactions: [],
  hasMore: true,
  operationTypes: [['transfer', 'claim_reward_balance'], ['transfer'], ['claim_reward_balance']],
  currentOperation: 0
};

export default function transactionHistory(state = initialState, action) {
  switch (action.type) {
    case 'GET_TRANSACTION_HISTORY_REQUEST':
      return {
        ...state,
        loading: true
      };
    case 'GET_TRANSACTION_HISTORY_SUCCESS':
      return {
        ...state,
        transactions: action.transactions.concat(state.transactions),
        loading: false,
        hasMore: action.hasMore
      };
    case 'CHANGE_TRANSACTION_FILTER':
      return {
        ...state,
        currentOperation: action.currentOperation
      };
    case 'GET_TRANSACTION_HISTORY_ERROR':
      return {
        ...state,
        loading: false
      };
    case 'CLEAR_TRANSACTION_HISTORY':
      return {
        ...state,
        transactions: []
      };
    default:
      return state;
  }
}
