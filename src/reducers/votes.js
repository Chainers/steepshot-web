import constants from '../common/constants';

const initialState = {
    voters : {
        results : [],
        offset : '',
        count : 0,
        total_count : 0
    },
    url : ''
};

function groupVoters(stateVoters, actionVoters) {
    stateVoters.offset = actionVoters.offset;
    stateVoters.results.pop();
    stateVoters.results = stateVoters.results.concat(actionVoters.results);
    stateVoters.total_count = actionVoters.total_count;
    return stateVoters;
}

export default function votes(state = initialState, action) {
    switch (action.type) {
        case 'NEW_LIKES_INFO' :
            return Object.assign({}, state, {
                voters: groupVoters(state.voters, action.voters)
            });
        case 'CLEAR_LIKES_INFO' : 
            return Object.assign({}, state, {
                voters : {
                    results : [],
                    offset : '',
                    count : 0,
                    total_count : 0
                },
                url : action.url
            });
        default:
            return state;
    }
}