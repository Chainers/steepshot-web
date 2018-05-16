import steem from 'steem';
import {blockchainErrorsList} from "../utils/blockchainErrorsList";
import Constants from "../common/constants";
import PostService from "./postService";
import AuthService from "./authService";

class SteemService {

	static getValidTransaction() {
		const operation = [Constants.OPERATIONS.COMMENT, {
			parent_author: '',
			parent_permlink: '',
			author: AuthService.getUsername(),
			permlink:  PostService.createPostPermlink('steepshot'),
			title: 'steepshot',
			description: '',
			body: 'steepshot',
			json_metadata: {
				tags: ['steepshot'],
				app: 'steepshot'
			}
		}];
		return steem.broadcast._prepareTransaction({
			extensions: [],
			operations: [operation],
		}).then(transaction => {
			return steem.auth.signTransaction(transaction, [AuthService.getPostingKey()])
		}).catch(error => {
			let checkedError = blockchainErrorsList(error);
			return Promise.reject(checkedError);
		});
	}

	static getBeneficiaries(permlink, beneficiaries) {
		let beneficiariesObject = {
			author: AuthService.getUsername(),
			permlink: permlink,
			max_accepted_payout: Constants.STEEM_PATLOAD.MAX_ACCEPTED_PAYOUT,
			percent_steem_dollars: Constants.STEEM_PATLOAD.PERCENT_STEMM_DOLLARS,
			allow_votes: true,
			allow_curation_rewards: true,
			extensions: [[0, {beneficiaries: beneficiaries}]]
		};

		return [Constants.OPERATIONS.COMMENT_OPTIONS, beneficiariesObject];
	}
}

export default SteemService;