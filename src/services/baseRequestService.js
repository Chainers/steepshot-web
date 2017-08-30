'use strict';
import constants from '../common/constants';
import { getStore } from '../store/configureStore';

const baseUrl = constants.URLS.baseUrl;

class BaseRequestService {
    getDefaultOptions() {
        return {
            limit: 10,
            offset: null
        };
    }

    convertOptionsToRequestString(options) {
        let optionsRequetString = '';
        let optionsArray = [];
        if (!options.offset) {
            return optionsRequetString;
        }

        for (let key in options) {
            optionsArray.push(key + '=' + options[key]);
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