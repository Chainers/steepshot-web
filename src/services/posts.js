import RequestService from './requestService';
import Constants from '../common/constants';
import Promise from 'bluebird';
import storage from "../utils/Storage";

Promise.config({
	warnings: true,
	cancellation: true,
	monitoring: true
});


export function getItems(options) {

	let defOptions = {
		limit: Constants.POSTS_SETTINGS.defaultLimit,
		offset: null,
		show_nsfw: storage.settings.show_nsfw || Constants.SETTINGS.DEFAULT.show_nsfw,
		show_low_rated: storage.settings.show_low_rated || Constants.SETTINGS.DEFAULT.show_low_rated,
		username: storage.username || undefined
	};

	defOptions = {
		...defOptions,
		...options.params
	};

	return RequestService.get(options.point, defOptions);
}

export function getPosts(options) {
	return getItems(options);
}

export function getComments(options) {
	return getItems(options);
}

export function getFollowers(options) {
	return getItems(options);
}

export function getFollowing(options) {
	return getItems(options);
}

export function getUsersSearch(options) {
	return getItems(options);
}

export function getVoters(options) {
	return getItems(options);
}

export function getPostShaddow(urlPost) {
	let options = {
		show_nsfw: true,
		show_low_rated: true,
		username: storage.username || undefined
	};

	return RequestService.get(`post/${urlPost}/info`, options);
}