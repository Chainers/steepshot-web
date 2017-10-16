'use strict';
import BaseRequestService from './baseRequestService';

class RequestService extends BaseRequestService{
    constructor(props) {
        super(props);
    }
    _getHandledOptions(options) {
        var newOptions = this.getDefaultOptions();

        return this.convertOptionsToRequestString(Object.assign(newOptions, options))
    }

    handleBaseRequestPosts(url, options) {
        return this.getBaseUrl() + '/' + url + this._getHandledOptions(options);
    }
    
    handleRequestPosts(url, options) {
        return this.getUrl() + '/' + url + this._getHandledOptions(options);
    }

    handleRequestUserInfo(url) {
        return this.getUrl() + '/' + url;
    }
}

export default new RequestService();