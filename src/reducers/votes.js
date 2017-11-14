import constants from '../common/constants';

const initialState = {
    voters : [],
    url : ''
};

export default function votes(state = initialState, action) {
    switch (action.type) {
        case 'NEW_LIKES_INFO' :
            return Object.assign({}, state, {
                voters: action.voters
            });
        case 'CLEAR_LIKES_INFO' : 
            return Object.assign({}, state, {
                voters : [],
                url : action.url
            });
        default:
            return state;
    }
}