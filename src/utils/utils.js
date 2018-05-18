export const utils = {

	tagPrettify: str => str.charAt(0) !== '#' ? '#' + str : str,

	isNotEmptyString: str => isNotEmpty(str) && str.trim().length > 0,

	isEmptyString: str => !utils.isNotEmptyString(str),

	isNotEmpty: isNotEmpty,

	cloneObject: (object) => JSON.parse(JSON.stringify(object)),

	getFirstObjectField: (obj) => obj[Object.keys(obj)[0]],

	getWindowDimension: () => {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	},

	equalsObjects: (a, b, depth = 5) => {
		if (depth < 0) {
			return true;
		}
		const typeA = typeof a;
		const typeB = typeof b;
		if (typeA !== typeB) {
			return false;
		}
		if (typeA !== 'object' || !a || !b) {
			return a === b;
		}

		const aProps = Object.getOwnPropertyNames(a);
		const bProps = Object.getOwnPropertyNames(b);

		if (aProps.length !== bProps.length) {
			return false;
		}

		for (let i = 0; i < aProps.length; i++) {
			let propName = aProps[i];

			if (!utils.equalsObjects(a[propName], b[propName], depth - 1)) {
				return false;
			}
		}

		return true;
	}
};

function isNotEmpty(variable) {
	return variable !== undefined && variable !== null;
}
