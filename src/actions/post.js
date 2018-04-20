import {getPostShaddow} from '../services/posts';
import Steem from '../libs/steem';
import {getStore} from '../store/configureStore';
import {initPostsList} from './postsList';
import {initPostModal} from './postModal';
import Constants from '../common/constants';
import jqApp from "../libs/app.min";

export function addPosts(posts) {
	return {
		type: 'ADD_POSTS',
		posts
	}
}

export function updatePost(postIndex) {
	return (dispatch) => {
		if (!postIndex.includes('#')) {
			updatePostData(dispatch, postIndex);
		}
	}
}

function updatePostData(dispatch, postIndex) {
	const urlObject = postIndex.split('/');
	getPostShaddow(urlObject[urlObject.length - 2] + '/' +
		urlObject[urlObject.length - 1]).then((result) => {
		dispatch({
			type: 'UPDATE_POST',
			post: result
		})
	});
}

export function setPowerLikeInd(postIndex, isOpen, place) {
	return (dispatch) => {
		dispatch({
			type: 'POWER_OF_LIKE_IND',
			index: postIndex,
			isPLOpen: isOpen,
			powerLikeIndPlace: place
		})
	}
}

export function setPowerLikeTimeout(postIndex, timeout) {
	return (dispatch) => {
		dispatch({
			type: 'POWER_OF_LIKE_TIMEOUT',
			index: postIndex,
			plTimeout: timeout
		})
	}
}

export function setHidePowerLikeTimeout(postIndex, timeout) {
	return (dispatch) => {
		dispatch({
			type: 'HIDE_POWER_OF_LIKE_TIMEOUT',
			index: postIndex,
			hplTimeout: timeout
		})
	}
}

function sendDeletePost(postIndex) {
	return {
		type: 'SEND_DELETE_POST',
		index: postIndex
	}
}

function successDeletePost(postIndex) {
	return {
		type: 'SUCCESS_DELETE_POST',
		index: postIndex
	}
}

function failureDeletePost(postIndex) {
	return {
		type: 'FAILURE_DELETE_POST',
		index: postIndex
	}
}

export function deletePost(postIndex) {
	return function (dispatch) {
		let state = getStore().getState();
		let post = state.posts[postIndex];
		let title = post.title, tags = post.tags, description = post.description, parentPerm = post.category;
		let username = state.auth.user;
		let postingKey = state.auth.postingKey;
		const urlObject = postIndex.split('/');
		let permlink = urlObject[urlObject.length - 1];
		let queue = sessionStorage.getItem('voteQueue');
		if (queue === 'true') {
			return false;
		}
		sessionStorage.setItem('voteQueue', 'true');
		dispatch(sendDeletePost(postIndex));
		const callback = (err, success) => {
			sessionStorage.setItem('voteQueue', 'false');
			if (success) {
				dispatch(successDeletePost(postIndex));
				jqApp.pushMessage.open(Constants.DELETE.DELETE_SUCCESS);
			} else if (err) {
				Steem.editDelete(title, tags, description, permlink, parentPerm).then(() => {
					jqApp.pushMessage.open(Constants.DELETE.DELETE_SUCCESS);
					dispatch(successDeletePost(postIndex));
				}).catch((err) => {
					dispatch(failureDeletePost(postIndex));
					jqApp.pushMessage.open(err)
				});
			}
		};
		Steem.deletePost(postingKey, username, permlink, callback);
	}
}

export function addSinglePost(url) {
	return async dispatch => {
		const urlObject = url.split('/');
		if (urlObject.length < 3) {
			error();
		} else {
			await getPostShaddow(getPostIdentifier(urlObject[urlObject.length - 2],
				urlObject[urlObject.length - 1]))
				.then((result) => {
					if (result) {
						let postOptions = {
							point: 'SinglePost',
							cancelPrevious: false,
							maxPosts: 1,
							loading: false,
							posts: [result.url],
							length: 0,
							hasMore: false,
						};
						dispatch(initPostsList(postOptions));
						dispatch(addPosts({
							[result.url]: {
								...result, isVideo: result.media[0].url.match(/mp4$/i)
							}
						}));
						dispatch(initPostModal('SinglePost', result.url));
					} else {
						this.error();
					}
				});
		}
	}
}

function getPostIdentifier(author, permlink) {
	return `${author}/${permlink}`;
}

function error() {
	let state = getStore().getState();
	jqApp.pushMessage.open(
		'Something went wrong, please, check the URL or try again later');
	setTimeout(() => {
		if (state.auth.name && state.auth.postingKey) {
			//browserHistory.push('/feed');
		} else {
			//browserHistory.push('/browse');
		}
	}, 3000);
}


export function playVideo(index) {
	return {
		type: 'POST_PLAY_VIDEO',
		index
	}
}

export function stopVideo(index) {
	return {
		type: 'POST_STOP_VIDEO',
		index
	}
}



