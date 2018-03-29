export function addMetaTags(tags) {
	return {
		type: 'ADD_META_TAGS',
		tags
	}
}

export function getDefaultTags(hostname, pathname) {
	return [
		{property: 'og:title', content: "steepshot.io"},
		{property: 'og:type', content: 'website'},
		{property: 'og:url', content: hostname + pathname},
		{property: 'og:image', content: hostname + '/images/steepshotLogo@2x.svg'}
	]
}

export function getTags(title, url, imageUrl) {
	return [
		{property: 'og:title', content: title},
		{property: 'og:type', content: 'website'},
		{property: 'og:url', content: url},
		{property: 'og:image', content: imageUrl}
	]
}