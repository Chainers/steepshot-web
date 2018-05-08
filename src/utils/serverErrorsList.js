import constants from '../common/constants';

export function serverErrorsList(error) {
  let errorsList = [
    {errorStatus: '504', notificationText: 'Gateway Timeout Error. Please, come back later.'},
    {errorStatus: '503', notificationText: 'Service Temporarily Unavailable. Please, come back later.'},
    {errorStatus: '502', notificationText: 'Bad Gateway. It\'s too many requests to our server. Please try later.' },
    {errorStatus: '500', notificationText: 'Internal server error. Please, come back later.'},
  ];
  for (let i = 0; i < errorsList.length; i++) {
    if (errorsList[i].errorStatus === error) {
      return errorsList[i].notificationText
    }
  }
  return constants.EMPTY_QUERY;
}