
let LocalStorage = {
	setAuthData: (username, postingKey, avatar, service) => {
		this.username = username;
		this.postingKey = postingKey;
		this.like_power = 100;
		this.avatar = avatar;
		this.service = service;
	},

	setSteemConnectData: (username, expiresIn, accessToken, avatar, service) => {
		this.username = username;
		this.expiresIn = expiresIn;
		this.accessToken = accessToken;
		this.like_power = 100;
		this.avatar = avatar;
		this.service = service;
	},

	clearAuthData: () => {
		this.username = null;
		this.postingKey = null;
		this.like_power = null;
		this.avatar = null;
		this.service = null;
		this.settings = null;
		this.expiresIn = null;
		this.accessToken = null;
	}
};

const storage = new Proxy(LocalStorage, {
	get: function(target, name) {
		try {
			return JSON.parse(localStorage.getItem(name));
		} catch (e) {
			localStorage.setItem(name, null);
			return null;
		}
	},
	set: function(target, name, value) {
		localStorage.setItem(name, JSON.stringify(value));
		target[name] = value;
		return true;
	}
});

export default storage;
