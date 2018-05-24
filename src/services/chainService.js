class ChainService {
	static currentService = null;
	
	static initConfig(service) {
		ChainService.currentService = service;
		ChainService.currentService.initConfig();
	}

	static setService(service) {
		ChainService.currentService = service;
	}

	static addCommentToBlockchain(commentOperation) {
		return ChainService.currentService.addCommentToBlockchain(commentOperation);
	}

	static changeVoteInBlockchain(postAuthor, permlink, power) {
		return ChainService.currentService.changeVoteInBlockchain(postAuthor, permlink, power);
	}

	static deletePostFromBlockchain(permlink) {
		return ChainService.currentService.deletePostFromBlockchain(permlink);
	}

	static changeFollowInBlockchain(jsonData) {
		return ChainService.currentService.changeFollowInBlockchain(jsonData)
	}

	static addPostDataToBlockchain(operations) {
		return ChainService.currentService.addPostDataToBlockchain(operations);
	}

	static getAccounts(username) {
		return ChainService.currentService.getAccounts(username);
	}

	static wifIsValid(postingKey, pubWif) {
		return ChainService.currentService.wifIsValid(postingKey, pubWif);
	}

	static getValidTransaction() {
		return ChainService.currentService.getValidTransaction();
	}

	static getBeneficiaries(permlink, beneficiaries) {
		return ChainService.currentService.getBeneficiaries(permlink, beneficiaries);
	}
	
}

export default ChainService;