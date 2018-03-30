import constants from '../common/constants';
import FormData from 'form-data';

const baseUrl = constants.URLS.baseUrl_v1;

export function preparePost(message, transaction) {
	let form = new FormData();
	form.append('title', message[1].title);
	form.append('description', message[1].description);
	form.append('username', message[1].author);
	form.append('photo', message[1].body);
	form.append('post_permlink', '@' + message[1].author + '/' + message[1].permlink,);
	form.append('trx', JSON.stringify(transaction));
	return fetch(`${baseUrl}/post/prepare`, {
		method: 'POST',
		body: form
	});
}

export function prepareComment(message, transaction) {
	let data = JSON.stringify({
		'body': message[1].body,
		'username': message[1].author
	});
	return fetch(`${baseUrl}/post/@${message[1].parent_author}/${message[1].parent_permlink}/comment/prepare`, {
		method: 'POST',
		body: data,
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
	});
}
