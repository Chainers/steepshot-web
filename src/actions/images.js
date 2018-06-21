import Constants from '../common/constants';

export function addImageLink(originalUrl, status) {

  const defaultAvaSize = Constants.DEF_AVATAR_SIZE;
  const userCardAvaSize = Constants.USER_CARD_AVATAR_SIZE;
  const userProfAvaSize = Constants.USER_PROFILE_AVATAR_SIZE;

  const defaultPostSize = Constants.DEF_POST_SIZE;

  let proxyUrl;
  if (status) {
    proxyUrl = {
      [defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + originalUrl,
      [userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + originalUrl,
      [userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + originalUrl,
      [defaultPostSize]: `https://steemitimages.com/${2 * defaultPostSize}x${2 * defaultPostSize}/` + originalUrl
    };
  }
  if (!status) {
    proxyUrl = originalUrl;
  }
  let imageLink = {[originalUrl]: proxyUrl};
  return {
    type: 'ADD_IMAGE_LINK',
    imageLink
  }
}