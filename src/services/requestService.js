'use strict';
import BaseRequestService from './baseRequestService';

class RequestService extends BaseRequestService{
    constructor(props) {
        super(props);
    }

    optionsConverter() {
        let newOptions = {};
        Array.prototype.map.call(arguments, (optionsPart) => { Object.assign(newOptions, optionsPart) });
        return this.convertOptionsToRequestString(newOptions);
    }

    handleBaseRequestPosts(url, options) {
        return this.getBaseUrl() + '/' + url + this.optionsConverter(this.getDefaultPostsOptions(options), this.getDefaultSettingsOptions(), options);
    }
    
    handleRequestPosts(url, options) {
        return this.getUrl() + '/' + url + this.optionsConverter(this.getDefaultPostsOptions(options), this.getDefaultSettingsOptions(), options);
    }

    handleBaseRequestPost(url) {
        return this.getBaseUrl() + '/' + url;
    }
  
    handleRequestUserInfo(url) {
        return this.getBaseUrl() + '/' + url + this.optionsConverter(this.getDefaultSettingsOptions());
    }
}

export default new RequestService();