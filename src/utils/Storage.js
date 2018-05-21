const storage = new Proxy({}, {
	get: function(target, name) {
		target[name] = JSON.parse(localStorage.getItem(name));
		return target[name];
	},
	set: function(target, name, value) {
		localStorage.setItem(name, JSON.stringify(value));
		target[name] = value;
		return true;
	}
});

export default storage;
