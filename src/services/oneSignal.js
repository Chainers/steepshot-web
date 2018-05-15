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

export async function setSubscribeConfiguration(username, postingKey, player_id, app_id, settings) {
	const url = Constants.URLS.baseUrl_v1_1 + '/subscribe';
	if (!username || !postingKey) {
		return;
	}
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

export async function changeSubscribeOnUser(subscriberName, subscribingName, player_id, app_id, subscribed) {
	const url = `${Constants.URLS.baseUrl_v1_1}/${subscribed ? 'un' : ''}subscribe`;
	let trx = await getValidTransaction();

	return fetch(url, {
			method: 'post',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({
				username: subscriberName,
				player_id,
				app_id,
				watched_user: subscribingName,
				trx
			})
		}).then( response => {
			if (response.status === 200) {
				return Promise.resolve();
			} else {
				return Promise.reject(response.statusText)
			}
		});
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