import {getStore} from '../store/configureStore';
import {addImageLink} from '../actions/images';
import Constants from '../common/constants';

const scale = Constants.IMAGE_SERVICE.SCALE;
const host = Constants.IMAGE_SERVICE.HOST;

class ImagesService {

	static getImagesWithProxy(originalUrl, size) {
		const store = getStore();
		const hash = store.getState().images;
		const proxy = `${host}${scale * size}x${scale * size}/`;
		const fullUrl = proxy + originalUrl;

		if (Object.keys(hash).includes(originalUrl)) {
			return;
		}
		const newImg = new Image();
		newImg.src = fullUrl;
		newImg.onload = () => {
			store.dispatch(addImageLink(originalUrl, size, fullUrl));
		};
		newImg.onerror = () => {
			store.dispatch(addImageLink(originalUrl, size));
		};
	}

}

export default ImagesService;