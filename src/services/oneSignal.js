import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import {getValidTransaction} from "./steem";

let OneSignal = window.OneSignal;

export function addNotificationTags(username, playerId) {
	if (!username) {
		return;
	}
	if (playerId) {
		OneSignal.sendTags({username, player_id: playerId});
		return;
	}
	OneSignal.getUserId().then(playerId => {
		if (playerId) {
			OneSignal.sendTags({username, player_id: playerId});
		}
	})
}

export function removeNotificationTags() {
	OneSignal.deleteTags(['username', 'player_id']);
}

export async function setSubscribeConfiguration() {
	const url = Constants.URLS.baseUrl_v1_1 + '/subscribe';
	const state = getStore().getState();
	const settings = state.settings;

	let username = state.auth.user;
	if (!username || !state.auth.postingKey) {
		return;
	}
	let player_id = state.oneSignal.playerId;
	let app_id = state.oneSignal.appId;
	let subscriptions = getSubscriptions(settings);
	let trx = await getValidTransaction();

	let response = await fetch(url, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username,
			player_id,
			app_id,
			subscriptions,
			trx
		})
	});
	return response;
}

export async function subscribeOnUser(watchedUser) {
	const url = Constants.baseUrl_v1_1 + '/subscribe';
	const state = getStore().getState();

	let username = state.auth.user;
	let player_id = state.oneSignal.playerId;
	let app_id = state.oneSignal.appId;
	let trx = await getValidTransaction();

	let response = await fetch(url, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username,
			player_id,
			app_id,
			watched_user: watchedUser,
			trx
		})
	});

	return response;
}

export async function unsubscribeFromUser(watchedUser) {
	const url = Constants.baseUrl_v1_1 + '/unsubscribe';
	const state = getStore().getState();

	let username = state.auth.user;
	let player_id = state.oneSignal.playerId;
	let app_id = state.oneSignal.appId;
	let trx = await getValidTransaction();

	let response = await fetch(url, {
		method: 'post',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			username,
			player_id,
			app_id,
			watched_user: watchedUser,
			trx
		})
	});

	return response;
}


function getSubscriptions(settings) {
	let subscriptions = [];
	addNotEmptySetting(subscriptions, settings, Constants.SETTINGS.FIELDS.post);
	addNotEmptySetting(subscriptions, settings, Constants.SETTINGS.FIELDS.comment);
	addNotEmptySetting(subscriptions, settings, Constants.SETTINGS.FIELDS.follow);
	addNotEmptySetting(subscriptions, settings, Constants.SETTINGS.FIELDS.upvote);
	addNotEmptySetting(subscriptions, settings, Constants.SETTINGS.FIELDS.upvote_comment);
	return subscriptions;
}

function addNotEmptySetting(subscriptions, settings, field) {
	if (settings[field]) {
		subscriptions.push(field);
	}
}