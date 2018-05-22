import steem from "steem";

const MAX_COUNT_TRY = 3;
const NODE_LIST = [
	//TODO should add to list when fixed node requests
	//'https://steemd.steepshot.org',
	'https://api.steemit.com',
	'https://api.steemitstage.com'
];
let currentNode = 0;

steem.api.setOptions({url: NODE_LIST[currentNode]});

class NodeService {

	static switchNode() {
		let infoMsg = `switch node from ${NODE_LIST[currentNode]} to `;
		currentNode = (currentNode + 1) % NODE_LIST.length;
		steem.api.setOptions({url: NODE_LIST[currentNode]});
		infoMsg += NODE_LIST[currentNode];
		console.log(infoMsg);
	}

	constructor() {
		this.countTry = 1;
	}

	setNextNode() {
		this.countTry++;
		NodeService.switchNode();
	}

	isMaxCountRequests() {
		return this.countTry >= MAX_COUNT_TRY;
	}
}

export default NodeService;