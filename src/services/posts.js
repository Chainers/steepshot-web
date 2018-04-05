import RequestService from './requestService';
import Constants from '../common/constants';
import Promise from 'bluebird';

Promise.config({
	warnings: true,
	cancellation: true,
	monitoring: true
});

const makeCancellableRequest = url =>
	new Promise((resolve, reject, onCancel) => {
		let xhr = new XMLHttpRequest();
		xhr.onload = resolve;
		xhr.onerror = reject;
		xhr.open("GET", url, true);
		xhr.send(null);
		onCancel(function () {
			xhr.abort();
		});
	});

let requestPromises = {
	[Constants.PROMISES.GET_COMMENTS]: Promise.resolve(),
	[Constants.PROMISES.GET_POSTS]: Promise.resolve(),
	[Constants.PROMISES.GET_FOLLOWERS]: Promise.resolve(),
	[Constants.PROMISES.GET_FOLLOWING]: Promise.resolve(),
	[Constants.PROMISES.GET_USERS_SEARCH]: Promise.resolve(),
	[Constants.PROMISES.GET_USERS_VOTERS]: Promise.resolve()
}

async function getItems(url, promiseName, needsDestroyPrevious, where) {

	if (requestPromises[promiseName].isPending() && needsDestroyPrevious) requestPromises[promiseName].cancel();

	try {
		return requestPromises[promiseName] = makeCancellableRequest(url).then(result => {
			return JSON.parse(result.target.response);
		});
	}
	catch (e) {
		console.warn(where);
		console.log(e);
		return [];
	}
}

export function getPosts(options, needsDestroyPrevious) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_POSTS, needsDestroyPrevious, 'getPosts');
}

export function getComments(options, needsDestroyPrevious) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_COMMENTS, needsDestroyPrevious, 'getComments');
}

export function getFollowers(options, needsDestroyPrevious) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_FOLLOWERS, needsDestroyPrevious, 'getFollowers');
}

export function getFollowing(options, needsDestroyPrevious) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_FOLLOWING, needsDestroyPrevious, 'getFollowing');
}

export function getUsersSearch(options, needsDestroyPrevious) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_USERS_SEARCH, needsDestroyPrevious, 'getUsersSearch');
}

export function getVoters(options) {
	const url = RequestService.handlev1_1BaseRequestPosts(options.point, options.params);
	return getItems(url, Constants.PROMISES.GET_USERS_VOTERS, false, 'getUserVoters');
}

export function getPostShaddow(urlPost) {
	const url = RequestService.handlev1_1BaseRequestPost(`post/${urlPost}/info`);
	return fetch(url, {
		method: 'GET'
	}).then((response) => {
		if (response.ok) {
			return response.json().then((json) => {
				return json;
			});
		} else {
			return response.json().then(() => {
				return null;
			});
		}
	});
}
