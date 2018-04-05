export function copyToClipboard(text) {
	return {
		type: 'COPY_TO_CLIPBOARD',
		text: text,
	};
}
