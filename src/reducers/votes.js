import constants from '../common/constants';

const initialState = {
    voteCanBePushed : true
};

export default function votes(state = initialState, action) {
    switch (action.type) {
        case 'SWITCH_MODE_FOR_QUEUE':
            return Object.assign({}, state, {
                voteCanBePushed: action.voteCanBePushed
            });
        default:
            return state;
    }
}