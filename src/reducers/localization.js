export default function localization(state = {}, action) {
  switch (action.type) {
    case 'CHANGE':
      return {
        change: true
      };
    default:
      return state;
  }
}
