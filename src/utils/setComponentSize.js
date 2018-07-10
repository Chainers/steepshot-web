import Constants from '../common/constants';

export function setComponentSize(windowSizes,
                                 imageSizes = {width: Constants.IMAGE.MIN_WIDTH, height: Constants.IMAGE.MIN_HEIGHT},
                                 isFullScreen) {
	const DESC_WIDTH = isFullScreen ? 0 : 380;
	const MIN_HEIGHT = 440;
	const MAX_WIDTH_FULL_SCREEN = 815;

	let sideMargin = 0.75;

	const docWidth = windowSizes.width;
	if (docWidth < 1080) {
		sideMargin = 0.6;
	}
	const docHeight = windowSizes.height;
	const MAX_IMG_WIDTH = (docWidth - DESC_WIDTH) * sideMargin;
	const PREFERRED_IMG_WIDTH = Constants.IMAGE.MIN_WIDTH;
	const isMobile = docWidth < MAX_WIDTH_FULL_SCREEN;

	const container = {};
	container.width = docWidth;
	container.height = '100%';

	const image = {};

	image.width = imageSizes.width;
	image.height = imageSizes.height;

	const imgCont = {};
	imgCont.width = '100%';
	const headerCont = {};
	if (isMobile) {
		headerCont.width = '100%';
	}

	const description = {};
	description.width = headerCont.width;
	if (docWidth > MAX_WIDTH_FULL_SCREEN) {
		image.width = image.width ? image.width : Math.min((docWidth - DESC_WIDTH) * sideMargin, PREFERRED_IMG_WIDTH);
		container.height = Math.max(docHeight * 0.9, MIN_HEIGHT);

		if (image.height > container.height) {
			image.width = image.width * container.height / image.height;
			image.height = container.height;
		}

		if (image.width > MAX_IMG_WIDTH) {
			image.height = image.height * MAX_IMG_WIDTH / image.width;
			image.width = MAX_IMG_WIDTH;
		}

		container.width = image.width + DESC_WIDTH;
		imgCont.width = image.width;
		headerCont.width = DESC_WIDTH;

		container.height = Math.max(image.height, MIN_HEIGHT);
	} else {
		image.width = Math.min(image.width, docWidth);
		image.width = image.width ? image.width : docWidth;
		image.height = image.height * image.width / imageSizes.width;
	}
	return {
		container,
		image,
		imgCont,
		headerCont,
		description,
		isMobile
	};
}