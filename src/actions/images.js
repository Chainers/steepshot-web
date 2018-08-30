import Constants from '../common/constants';

const defaultAvaSize = Constants.DEF_AVATAR_SIZE;
const userCardAvaSize = Constants.USER_CARD_AVATAR_SIZE;
const userProfAvaSize = Constants.USER_PROFILE_AVATAR_SIZE;

const defaultPostSize = Constants.DEF_POST_SIZE;

export function addImageLink(url, size, originalUrl, originalError) {
	let proxyUrl = {
		[size]: Constants.NO_AVATAR,
	};

	if (!originalError) {
		proxyUrl = {
			[size]: url,
		};
	}
	let imageLink = {[originalUrl]: proxyUrl};
	return {
		type: 'ADD_IMAGE_LINK',
		imageLink
	}
}


export function imageLoadError(imageUrl) {
	return {
		type: 'IMAGE_LOAD_ERROR',
		imageUrl
	}
}


export function imageLoadSuccess(imageUrl) {
	return {
		type: 'IMAGE_LOAD_SUCCESS',
		imageUrl
	}
}