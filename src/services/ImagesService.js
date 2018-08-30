import {getStore} from '../store/configureStore';
import {addImageLink} from '../actions/images';
import Constants from '../common/constants';

const hash = {};
const scale = Constants.IMAGE_SERVICE.SCALE;
const host = Constants.IMAGE_SERVICE.HOST;

class ImagesService {

	static getImagesWithProxy(originalUrl, size) {
		const proxy = `${host}${scale * size}x${scale * size}/`;
		const fullUrl = proxy + originalUrl;
		if (Object.keys(hash).includes(originalUrl)) {
			return;
		}
		const newImg = new Image();
		newImg.src = fullUrl;
		newImg.onload = () => {
			getStore().dispatch(addImageLink(fullUrl, size));
		};
		newImg.onerror = () => {
			const newOriginalImg = new Image();
      newOriginalImg.src = originalUrl;
      newOriginalImg.onload = () => {
      	getStore().dispatch(addImageLink(originalUrl, size, true));
      };
			newOriginalImg.onerror = () =>  {
				getStore().dispatch(addImageLink(originalUrl, size, true, true));
      }

		};
		hash[originalUrl] = newImg;
	}

}

export default ImagesService;