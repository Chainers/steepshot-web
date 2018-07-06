export default class Utils {

	static urlParamsToObject(urlParams) {
		let params = urlParams.replace('?', '').split('&');
		params = params.reduce((acc, cur) => {
			const field = cur.split('=');
			acc[field[0]] = field[1];
			return acc;
		}, {});
		return params
	};

	static tagPrettify(str) {
		return str.charAt(0) !== '#' ? '#' + str : str
	}

	static isNotEmptyString(str) {
		return Utils.isNotEmpty(str) && str.trim().length > 0
	}

	static isEmptyString(str) {
		return !Utils.isNotEmptyString(str)
	}

	static isNotEmpty(variable) {
		return variable !== undefined && variable !== null;
	}

	static cloneObject(object) {
		return JSON.parse(JSON.stringify(object))
	}

	static getFirstObjectField(obj) {
		return obj[Object.keys(obj)[0]]
	}

	static getWindowDimension() {
		return {
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		}
	}

	static equalsObjects(a, b, depth = 5) {
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
			if (propName === 'key') continue;
			if (!Utils.equalsObjects(a[propName], b[propName], depth - 1)) {
				return false;
			}
		}

		return true;
	}

	static detransliterate(str, reverse) {
		if (!str) return str;
		if (!reverse && str.substring(0, 4) !== 'ru--') return str;
		if (!reverse) {
			str = str.substring(4);
		}

		let prefix = '';
		if (reverse && /^[а-яё]/.test(str)) {
			prefix = 'ru--';
		}

		// TODO rework this
		// (didnt placed this earlier because something is breaking and i am too lazy to figure it out ;( )
		if (!reverse) {
			//    str = str.replace(/j/g, 'ь')
			//    str = str.replace(/w/g, 'ъ')
			str = str.replace(/yie/g, 'ые');
		} else {
			//    str = str.replace(/ь/g, 'j')
			//    str = str.replace(/ъ/g, 'w')
			str = str.replace(/ые/g, 'yie');
		}

		let i,
			s = /[^[\]]+(?=])/g, orig = str.match(s),
			t = /<(.|\n)*?>/g, tags = str.match(t);

		if (reverse) {
			for (i = 0; i < rus.length; ++i) {
				str = str.split(rus[i]).join(eng[i]);
				str = str.split(rus[i].toUpperCase()).join(eng[i].toUpperCase());
			}
		} else {
			for (i = 0; i < rus.length; ++i) {
				str = str.split(eng[i]).join(rus[i]);
				str = str.split(eng[i].toUpperCase()).join(rus[i].toUpperCase());
			}
		}

		if (orig) {
			let restoreOrig = str.match(s);

			for (i = 0; i < restoreOrig.length; ++i)
				str = str.replace(restoreOrig[i], orig[i]);
		}

		if (tags) {
			let restoreTags = str.match(t);

			for (i = 0; i < restoreTags.length; ++i)
				str = str.replace(restoreTags[i], tags[i]);

			str = str.replace(/\[/g, '').replace(/\]/g, '');
		}

		return prefix + str;
	}
}


const rus = "щ ш ч  ц  й  ё  э  ю  я  х  ж  а б в г д е з и к л м н о п р с т у ф ъ  ы ь ґ є і ї".split(/\s+/g),
	eng = "shch sh ch cz ij yo ye yu ya kh zh a b v g d e z i k l m n o p r s t u f xx y x g e i i".split(/\s+/g);