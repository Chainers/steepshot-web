import Remarkable from 'remarkable';

class MarkdownParser {

	static parse(text) {
		if (!text) text = '';

		let html = false;
		const m = text.match(/^<html>([\S\s]*)<\/html>$/);
		if (m && m.length === 2) {
			html = true;
			text = m[1];
		} else {
			html = /^<p>[\S\s]*<\/p>/.test(text);
		}

		text = text.replace(
			/<!--([\s\S]+?)(-->|$)/g,
			''
		);

		let renderedText = html ? text : remarkableToSpec.render(text);

		renderedText = renderedText.replace(/<script>|<\/script>/g, '');
		let anyLinks = renderedText.replace(/<a[\w\W]+?>([\w\W]+?)<\/a>/g, '$1');
		let userLink = anyLinks.replace(/([^/]|^)(@[\w-.]+\w)/g, '$1<a href="/$2" target="_blank">$2</a>');
		return userLink;
	}

	static parseTitle(text) {
		text = MarkdownParser.parse(text);
		text = text.replace(/<\/?[\w]+>/g, '');
		return text.replace(/([^/]|^)(@[\w-.]+\w)/g, '$1<a href="/$2" target="_blank">$2</a>');
	}
}

export default MarkdownParser;

const remarkableToSpec = new Remarkable({
	html: true,
	breaks: false, // real markdown uses \n\n for paragraph breaks
	linkify: false,
	typographer: false,
	quotes: '“”‘’',
});