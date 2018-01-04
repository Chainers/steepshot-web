const initialState = {
    comment: {}
};

export default function comment(state = {}, action) {
    switch (action.type) {
        case 'ADD_COMMENT_SUCCESS':
            return Object.assign({}, state, {
                comment: action.comment
            });
        case 'UPDATE_COMMENTS': {
            return initialState;
        }
        default:
            return state;
    }
}
