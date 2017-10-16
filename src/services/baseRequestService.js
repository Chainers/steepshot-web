'use strict';
import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const baseUrl = constants.URLS.baseUrl;

class BaseRequestService {
    getDefaultOptions() {
        return {
            limit: constants.POSTS_SETTINGS.defaultLimit,
            offset: null
        };
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
            if (options[key] != undefined) optionsArray.push(key + '=' + this.convertIfBool(options[key]));
        }

        return '?' + optionsArray.join('&');
    }

    getUrl() {
        if (getStore().getState().auth.user){
            return baseUrl + '/' + getStore().getState().auth.user
        }
        
        return baseUrl;
    }

    getBaseUrl() {
        return baseUrl;
    }

    handleBaseUrl(request) {
        if (!request) {
            return this.getBaseUrl();
        }

        return this.getBaseUrl() + '/' + request;
    }
}

export default BaseRequestService;