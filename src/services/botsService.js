import RequestService from './requestService';
import Constants from '../common/constants';
import {getStore} from '../store/configureStore';
import {addBot} from '../actions/promoteModal';

const supportableBots = Constants.SERVICES.BOTS.SUPPORTABLE_BOTS_LIST;

class BotsService {

  static getBotsList() {
    return RequestService.get(Constants.SERVICES.BOTS.BOTS_INFO)
      .then(response => {
        let suitableBots = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i].min_bid < Constants.SERVICES.BOTS.MIN_BID_VALUE) {
            continue;
          }
          for (let j = 0; j < supportableBots.length; j++) {
            if (response[i].name === supportableBots[j]) {
              suitableBots.push(response[i]);
            }
          }
        }
        //TODO checking for a one bot instead random arrayBots[0]
        let promoteModalInfo = getStore().getState().promoteModal;
        for (let i = 0; i < suitableBots.length; i++) {

        }

        let suitableBot = suitableBots[0];
        const options = {
          username: suitableBot.name,
        };
        return RequestService.get(`user/${suitableBot.name}/info`, options)
                .then(response => {
                  suitableBot.avatar = response.profile_image;
                  suitableBot.last = (suitableBot.last / 1000).toFixed(0);
                  suitableBot.next = (suitableBot.next / 1000).toFixed(0);
                  getStore().dispatch(addBot(suitableBot));
                  return Promise.resolve();
                });
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

}

export default BotsService;