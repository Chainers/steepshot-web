import Constants from '../common/constants';

const defaultAvaSize = Constants.DEF_AVATAR_SIZE;
const userCardAvaSize = Constants.USER_CARD_AVATAR_SIZE;
const userProfAvaSize = Constants.USER_PROFILE_AVATAR_SIZE;

export function addImageLink(originalUrl, param) {
	let proxyUrl;
	if (!param) {
		proxyUrl = {
			[defaultAvaSize]: originalUrl,
			[Constants.USER_CARD_AVATAR_SIZE]: originalUrl,
			[Constants.USER_PROFILE_AVATAR_SIZE]: originalUrl
		};
	}
	if (param) {
		proxyUrl = {
			[defaultAvaSize]: `https://steemitimages.com/${2 * defaultAvaSize}x${2 * defaultAvaSize}/` + originalUrl,
			[userCardAvaSize]: `https://steemitimages.com/${2 * userCardAvaSize}x${2 * userCardAvaSize}/` + originalUrl,
			[userProfAvaSize]: `https://steemitimages.com/${2 * userProfAvaSize}x${2 * userProfAvaSize}/` + originalUrl,
		};
	}
	let imageLink = {[originalUrl]: proxyUrl};
	return {
		type: 'ADD_IMAGE_LINK',
		imageLink
	}
}