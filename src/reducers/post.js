const initialState = {
    posts: []
};

export default function post(state = {}, action) {
    switch (action.type) {
        case 'GET_POST_SUCCESS':
            return Object.assign({}, state, {
                posts: action.posts
            });
        case 'GET_POSTS__FAILURE':
            return initialState;
        case 'UPDATE_COMMENTS': {
            return initialState;
        }
        default:
            return state;
    }
}
