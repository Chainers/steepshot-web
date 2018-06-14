import storage from "../utils/Storage";

class StorageService {
	static setAuthData(username, postingKey, avatar, service) {
		storage.username = username;
		storage.postingKey = postingKey;
		storage.like_power = 100;
		storage.avatar = avatar;
		storage.service = service;
	}

	static setSteemConnectData(username, expiresIn, accessToken, avatar, service) {
		storage.username = username;
		storage.expiresIn = expiresIn;
		storage.accessToken = accessToken;
		storage.like_power = 100;
		storage.avatar = avatar;
		storage.service = service;
	}

	static clearAuthData() {
		storage.username = null;
		storage.postingKey = null;
		storage.like_power = null;
		storage.avatar = null;
		storage.service = null;
		storage.settings = null;
		storage.expiresIn = null;
		storage.accessToken = null;
	}
}

export default StorageService;