import golos from 'golos-js';
import Constants from "../common/constants";

class GolosService {

	init() {
		golos.config.set('websocket', Constants.BLOCKCHAIN.GOLOS.CONNECTION_SERVERS[0]);
		golos.config.set('address_prefix', Constants.BLOCKCHAIN.GOLOS.PREFIX);
		golos.config.set('chain_id', Constants.BLOCKCHAIN.GOLOS.CHAIN_ID);
	}

	setService(service) {
	}

	addCommentToBlockchain(commentOperation) {
	}

	changeVoteInBlockchain(postAuthor, permlink, power) {
	}

	deletePostFromBlockchain(permlink) {
	}

	changeFollowInBlockchain(jsonData) {
	}

	addPostDataToBlockchain(operations) {
	}

	getAccounts(username) {
	}

	wifIsValid(postingKey, pubWif) {
	}

	getValidTransaction() {
	}

	getBeneficiaries(permlink, beneficiaries) {
	}
}

export default GolosService;