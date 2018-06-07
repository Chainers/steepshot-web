export default function chooseSteemRegModal(state = {}, action) {
  switch (action.type) {
    case 'SET_LINK_TO_SERVICE':
      return {
        ...state,
        serviceIndex: action.index,
        linkToService: action.link
      };
    default:
      return state;
  }
}