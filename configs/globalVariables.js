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
	return {
		matches: false,
		addListener: function () {
		},
		removeListener: function () {
		}
	};
};
global.document = window.document;
global.isServerSide = true;