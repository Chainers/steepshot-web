'use strict';
import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const basev1_1Url = constants.URLS.baseUrl_v1_1;
const basev1Url = constants.URLS.baseUrl_v1;
const baseLimit = constants.POSTS_SETTINGS.defaultLimit;

class BaseRequestService {
    getDefaultPostsOptions(options) {
        let calcLimit = baseLimit;
        if (options != undefined)
        if (options.offset != undefined && options.offset != '') calcLimit++;
        return {
            limit: calcLimit,
            offset: null
        };
    }

    getDefaultSettingsOptions() {
        const settings = JSON.parse(localStorage.getItem("settings"));

        if (settings == undefined) return {}

        let nsfw = false;
        let low_rated = false;

        if (typeof settings[constants.SETTINGS.show_nsfw] == 'boolean') {
            nsfw = settings[constants.SETTINGS.show_nsfw];
        }

        if (typeof settings[constants.SETTINGS.show_low_rated] == 'boolean') {
            low_rated = settings[constants.SETTINGS.show_low_rated];
        }
        return {
            [constants.SETTINGS.show_nsfw]: nsfw,
            [constants.SETTINGS.show_low_rated]: low_rated
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
        if (user == undefined) return {};

        return {
            username: user
        }
    }

    convertIfBool(option) {
        if (option == true) {
            return "1";
        } else
        if (option == false) {
            return "0";
        } else {
            return option;
        }
    }

    convertOptionsToRequestString(options) {
        let optionsRequetString = '';
        let optionsArray = [];

        for (let key in options) {
            if (options[key] != undefined && options[key] != null) optionsArray.push(key + '=' + this.convertIfBool(options[key]));
        }

        return '?' + optionsArray.join('&');
    }

    getv1Url() {
        if (getStore().getState().auth.user){
            return basev1Url + '/' + getStore().getState().auth.user
        }

        return baseUrl;
    }

    getBasev1Url() {
        return basev1Url;
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
