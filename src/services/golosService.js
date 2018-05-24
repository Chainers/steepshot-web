import golos from 'golos-js';
import Constants from "../common/constants";
import ChainService from "./chainService";

class GolosService {

	static initConfig() {
		golos.config.set('websocket', Constants.BLOCKCHAIN.GOLOS.CONNECTION_SERVERS[0]);
		golos.config.set('address_prefix', Constants.BLOCKCHAIN.GOLOS.PREFIX);
		golos.config.set('chain_id', Constants.BLOCKCHAIN.GOLOS.CHAIN_ID);
	}

	static setService(service) {
	}

	static addCommentToBlockchain(commentOperation) {
	}

	static changeVoteInBlockchain(postAuthor, permlink, power) {
	}

	static deletePostFromBlockchain(permlink) {
	}

	static changeFollowInBlockchain(jsonData) {
	}

	static addPostDataToBlockchain(operations) {
	}

	static getAccounts(username) {
	}

	static wifIsValid(postingKey, pubWif) {
	}

	static getValidTransaction() {
	}

	static getBeneficiaries(permlink, beneficiaries) {
	}
}

export default GolosService;