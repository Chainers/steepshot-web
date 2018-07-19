import {getStore} from '../store/configureStore';
import {addImageLink} from '../actions/images';

const hash = {};

class ImagesService {

	static getImagesWithProxy(originalUrl, proxy, param) {
		const fullUrl = proxy + originalUrl;
		if (Object.keys(hash).includes(originalUrl)) {
			return;
		}
		const newImg = new Image();
		newImg.src = fullUrl;
		if (param) {
			newImg.onload = () => {
				getStore().dispatch(addImageLink(originalUrl, param));
			};
		}
		newImg.onerror = () => {
			getStore().dispatch(addImageLink(originalUrl, param));
		};
		hash[originalUrl] = newImg;
	}

}

export default ImagesService;