import BaseRequestService from './baseRequestService';

class RequestService extends BaseRequestService{

    optionsConverter() {
        let newOptions = {};
        Array.prototype.map.call(arguments, (optionsPart) => { Object.assign(newOptions, optionsPart) });
        return this.convertOptionsToRequestString(newOptions);
    }

    handlev1_1BaseRequestPosts(url, options) {
        return this.getBasev1_1Url() + '/' + url +
        this.optionsConverter(this.getDefaultPostsOptions(), this.getDefaultSettingsOptions(), this.getAuthUser(), options);
    }

    handlev1_1BaseRequestPost(url) {
        return this.getBasev1_1Url() + '/' + url
        + this.optionsConverter(this.getCustomSettingsOptions(true, true), this.getAuthUser());
    }

    handlev1_1RequestUserInfo(url, options) {
        return this.getBasev1_1Url() + '/' + url +
        this.optionsConverter(this.getDefaultSettingsOptions(), this.getAuthUser(), options);
    }
}

export default new RequestService();
