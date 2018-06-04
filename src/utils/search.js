import {utils} from "./utils";

export function insertCategory(point, category) {
	if (category === undefined) return point;
	category = utils.detransliterate(category, true);
	let path = point.split('/');
	return `${path[0]}/${category}/${path[1]}`;
}
