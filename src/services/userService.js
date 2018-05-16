import RequestService from "./requestService";
import storage from "../utils/Storage";

class UserService {

	static getUsersList(url, offset, limit, currentOptions) {
		const options = {
			offset,
			limit,
			...currentOptions
		};
		return RequestService.get(url, options);
	}

	static getWaitingTimeForCreate(username) {
		return RequestService.get(`/user/${username}/spam`);
	}

	static getProfile(username) {
		const options = {
			show_nsfw: true,
			show_low_rated: true,
			username: storage.username || undefined
		};
		return RequestService.get(`user/${username}/info`, options);
	}

}

export default UserService;