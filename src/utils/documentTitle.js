import {utils} from './utils';

export function documentTitle() {
	let title = window.location.pathname.replace('/', '');
	title = utils.detransliterate(decodeURI(title), true);
	if (title === 'signin') {
		title = 'sign in';
	}
	if (title === '*') {
		title = '404 error';
	}
	if (title.match(/editPost\/[\w\W]+/g)) {
		title = 'Edit post';
	}
	if (title.match(/editPost/g)) {
		title = 'Create post';
	}
	let titleArr = title.split('');

	let capitalLetter = title.search(/[A-Z]/g);
	if (capitalLetter !== -1) {
		titleArr[capitalLetter] = titleArr[capitalLetter].toLowerCase();
	}
	titleArr[0] = titleArr[0].toUpperCase();
	if (title.match(/[A-Z]/g) !== null) {
		titleArr.splice(title.search(/[A-Z]/g), 0, ' ');
		return document.title = `${titleArr.join('')} | Steepshot`
	} else {
		return document.title = `${titleArr.join('')} | Steepshot`
	}
}


