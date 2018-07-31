import Constants from '../common/constants';

const defaultAvaSize = Constants.DEF_AVATAR_SIZE;
const userCardAvaSize = Constants.USER_CARD_AVATAR_SIZE;
const userProfAvaSize = Constants.USER_PROFILE_AVATAR_SIZE;

const defaultPostSize = Constants.DEF_POST_SIZE;

export function addImageLink(originalUrl, proxyError, originalError) {
	let proxyUrl;
	if (proxyError && originalError) {
    proxyUrl = {
      [defaultAvaSize]: Constants.NO_AVATAR,
      [userCardAvaSize]: Constants.NO_AVATAR,
      [userProfAvaSize]: Constants.NO_AVATAR,
      [defaultPostSize]: Constants.NO_IMAGE
    };
	}
	if (proxyError && !originalError) {
		proxyUrl = {
			[defaultAvaSize]: originalUrl,
			[userCardAvaSize]: originalUrl,
			[userProfAvaSize]: originalUrl,
      [defaultPostSize]: originalUrl
		};
	}
	if (!proxyError && !originalError) {
		proxyUrl = {
			[defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + originalUrl,
			[userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + originalUrl,
			[userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + originalUrl
		};
	}
	let imageLink = {[originalUrl]: proxyUrl};
	return {
		type: 'ADD_IMAGE_LINK',
		imageLink
	}
}