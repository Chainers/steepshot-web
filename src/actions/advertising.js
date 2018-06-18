import storage from '../utils/Storage';

export function setAdvertisingStatus(status) {
	storage.footballContestAdvertisingStatus = status;
  return {
    type: 'SET_ADVERTISING_STATUS',
    status
  }
}