import {getComments} from "../services/posts";
import {getStore} from "../store/configureStore";
import Constants from "../common/constants";
import jqApp from "../libs/app.min";

export function getPostCommets(point) {
	const post = getStore().getState().posts[point];
	if (!post) {
		jqApp.pushMessage.open(Constants.OOOPS_SOMETHING_WRONG);
		return {
			type: "Can't find post.",
			point
		}
	}
	return (dispatch) => {
		dispatch({
			type: 'INIT_POST_COMMENTS',
			options: {
				point,
				loading: true,
				comments: []
			}
		});
		const options = {
			point: `post/${post.author}/${post.url}/comments`,
			params: {}
		};
		getComments(options, true).then((response) => {
			dispatch({
				type: 'GET_POST_COMMENTS_SUCCESS',
				point,
				comments: response.results
			});
		});

	}
}