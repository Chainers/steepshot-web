export function setAdvertisingStatus(status) {
  localStorage.setItem('advertisingStatus', status);
  return {
    type: 'SET_ADVERTISING_STATUS',
    status
  }
}