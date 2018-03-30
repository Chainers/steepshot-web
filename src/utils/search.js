export function insertCategory(point, category) {
	if (category === undefined) return point;
	let path = point.split('/');
	return `${path[0]}/${category}/${path[1]}`;
}
