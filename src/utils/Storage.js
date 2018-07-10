const storage = new Proxy({}, {
	get: function (target, name) {
		try {
			return JSON.parse(localStorage.getItem(name));
		} catch (e) {
			localStorage.setItem(name, null);
			return null;
		}
	},
	set: function (target, name, value) {
		localStorage.setItem(name, JSON.stringify(value));
		target[name] = value;
		return true;
	}
});

export default storage;
