import constants from '../common/constants';

const basev1_1Url = constants.URLS.baseUrl_v1_1;

class BaseRequestService {
    getDefaultPostsOptions() {
        return {
            limit: constants.POSTS_SETTINGS.defaultLimit,
            offset: null
        };
    }

    getDefaultSettingsOptions() {
        const settings = JSON.parse(localStorage.getItem("settings"));

        if (settings === undefined) return {};

        let nsfw = false;
        let low_rated = false;

        return {
            [constants.SETTINGS.show_nsfw]: nsfw,
            [constants.SETTINGS.show_low_rated]: low_rated,
        };
    }

    getCustomSettingsOptions(nsfw, low_rated) {
        return {
            [constants.SETTINGS.show_nsfw]: nsfw,
            [constants.SETTINGS.show_low_rated]: low_rated
        };
    }

    getAuthUser() {
        const user = JSON.parse(localStorage.getItem("user"));
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
