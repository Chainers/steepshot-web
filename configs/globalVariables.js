global.localStorage = {
	getItem: () => {
		return null
	}
};
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM(``);
global.window = window;
window.$ = require('jquery');
for (let key in window) {
	if (!global[key]) {
		global[key] = window[key]
	}
}