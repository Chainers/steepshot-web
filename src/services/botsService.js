import RequestService from './requestService';
import Constants from '../common/constants';
import {getStore} from '../store/configureStore';
import {addBot} from '../actions/promoteModal';

const SUPPORTABLE_BOTS = Constants.SERVICES.BOTS.SUPPORTABLE_BOTS_LIST;
const MILISECONDS_IN_SECONDS = 1000;

class BotsService {

  static getBotsList(postIndex) {
    return RequestService.get(Constants.SERVICES.BOTS.BOTS_INFO)
      .then(response => {
        let suitableBots = [];
        for (let i = 0; i < response.length; i++) {
          if (response[i]['min_bid'] < Constants.SERVICES.BOTS.MIN_BID_VALUE) {
            continue;
          }
          for (let j = 0; j < SUPPORTABLE_BOTS.length; j++) {
            if (response[i].name === SUPPORTABLE_BOTS[j]) {
              suitableBots.push(response[i]);
            }
          }
        }
        return RequestService.get(Constants.SERVICES.BOTS.BOOTS_TOKENS_COURSES)
          .then(courses => {
            const steemToUSD = courses['steem_price'].toFixed(2);
            const sbdToUSD = courses['sbd_price'].toFixed(2);
            const postAge = getStore().getState().posts[postIndex].postAge;

            let promoteModalInfo = getStore().getState().promoteModal;
            let promoteAmount = +promoteModalInfo.promoteAmount;
            let muchSuitableBots = [];
            for (let i = 0; i < suitableBots.length; i++) {
              if (suitableBots[i]['min_bid'] <= promoteAmount) {
                if (suitableBots[i].next <= 60 * MILISECONDS_IN_SECONDS || postAge >= suitableBots[i]['max_post_age'] ||
                  !BotsService.checkAmount(promoteAmount, steemToUSD, sbdToUSD, promoteModalInfo.selectedToken, suitableBots[i])) {
                  continue;
                }
                if (muchSuitableBots.length >= 1) {
                  if (muchSuitableBots[0].next > suitableBots[i].next) {
                    muchSuitableBots.unshift(suitableBots[i]);
                  } else {
                    muchSuitableBots.push(suitableBots[i]);
                  }
                } else {
                  muchSuitableBots.push(suitableBots[i]);
                }
              }
            }

            let suitableBot = muchSuitableBots[0];
            const options = {
              username: suitableBot.name,
            };
            return RequestService.get(`user/${suitableBot.name}/info`, options)
              .then(response => {
                suitableBot.avatar = response['profile_image'];
                suitableBot.last = suitableBot.last / MILISECONDS_IN_SECONDS;
                suitableBot.next = suitableBot.next / MILISECONDS_IN_SECONDS;
                getStore().dispatch(addBot(suitableBot));
                return Promise.resolve();
              });
          })
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  static checkAmount(promoteAmount, steemToUSD, sbdToUSD, token, botInfo) {
    const amountLimit = botInfo['vote_usd'];
    const bidsAmountInBot = botInfo['total_usd'];
    let userBidInUSD;
    if (token === 'STEEM') {
      userBidInUSD = promoteAmount * steemToUSD;
    }
    if (token === 'SBD') {
      userBidInUSD = promoteAmount * sbdToUSD;
    }
    return (userBidInUSD + bidsAmountInBot) < amountLimit;
  }

}

export default BotsService;