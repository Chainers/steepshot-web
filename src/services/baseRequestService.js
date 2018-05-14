import Constants from "../common/constants";
import storage from "../utils/Storage";

const basev1_1Url = Constants.URLS.baseUrl_v1_1;

class BaseRequestService {
	getDefaultPostsOptions() {
		return {
			limit: Constants.POSTS_SETTINGS.defaultLimit,
			offset: null
		};
	}

	getDefaultSettingsOptions() {
		let settings = storage.settings
		|| {
			[Constants.SETTINGS.show_low_rated]: Constants.SETTINGS.DEFAULT.show_low_rated,
			[Constants.SETTINGS.show_nsfw]: Constants.SETTINGS.DEFAULT.show_nsfw
		};

		let nsfw = settings[Constants.SETTINGS.FIELDS.show_nsfw];
		let low_rated = settings[Constants.SETTINGS.FIELDS.show_low_rated];

		return {
			[Constants.SETTINGS.FIELDS.show_nsfw]: nsfw,
			[Constants.SETTINGS.FIELDS.show_low_rated]: low_rated,
		};
	}

	getCustomSettingsOptions(nsfw, low_rated) {
		return {
			[Constants.SETTINGS.FIELDS.show_nsfw]: nsfw,
			[Constants.SETTINGS.FIELDS.show_low_rated]: low_rated
		};
	}

	getAuthUser() {
		const user = storage.user;
		if (user === undefined) return {};
		return {
			username: user
		}
	}

	convertIfBool(option) {
		if (option === true) {
			return "1";
		} else if (option === false) {
			return "0";
		} else {
			return option;
		}
	}

	convertOptionsToRequestString(options) {
		let optionsArray = [];
		for (let key in options) {
			if (options[key] !== undefined && options[key] !== null) optionsArray.push(key + '=' + this.convertIfBool(options[key]));
		}
		return '?' + optionsArray.join('&');
	}

	getBasev1_1Url() {
		return basev1_1Url;
	}

	handleBaseUrl(request) {
		if (!request) {
			return this.getBaseUrl();
		}

		return this.getBaseUrl() + '/' + request;
	}
}

export default BaseRequestService;
