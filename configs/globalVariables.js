global.localStorage = {
	getItem: () => {
		return null
	}
};
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM(``);
global.window = window;
window.matchMedia = window.matchMedia || function () {
	return { matches
			: false,
		addListener: function () {},
		removeListener: function () {}
	};
};
for (let key in window) {
	if (!global[key]) {
		global[key] = window[key]
	}
}
global.isServerSide = true;