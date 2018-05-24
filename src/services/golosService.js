import golos from 'golos-js';
import Constants from "../common/constants";

class GolosService {

	initConfig() {
		golos.config.set('websocket', Constants.BLOCKCHAIN.GOLOS.CONNECTION_SERVERS[0]);
		golos.config.set('address_prefix', Constants.BLOCKCHAIN.GOLOS.PREFIX);
		golos.config.set('chain_id', Constants.BLOCKCHAIN.GOLOS.CHAIN_ID);
	}


}