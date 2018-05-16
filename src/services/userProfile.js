import RequestService from './requestService';
import Constants from "../common/constants";
import storage from "../utils/Storage";

export function getProfile(userName) {
	let options = {
		show_nsfw: true,
		show_low_rated: true,
		username: storage.username || undefined
	};

	return RequestService.get(`user/${userName}/info`, options);
}

export function getFollowers(userName, offset) {
	return getFollowUsers('followers', userName, offset);
}

export function getFollowing(userName, offset) {
	return getFollowUsers('following', userName, offset);
}

function getFollowUsers(whom, userName, offset) {
	const options = {
		offset: offset,
		limit: Constants.POSTS_SETTINGS.defaultLimit,
		show_nsfw: storage.settings.show_nsfw || Constants.SETTINGS.DEFAULT.show_nsfw,
		show_low_rated: storage.settings.show_low_rated || Constants.SETTINGS.DEFAULT.show_low_rated,
		username: storage.username || undefined
	};

	RequestService.get(`user/${userName}/${whom}`, options);

}
