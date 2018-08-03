import {getStore} from '../store/configureStore';
import {addImageLink} from '../actions/images';

const hash = {};

class ImagesService {

	static getImagesWithProxy(originalUrl, proxy, isHeader) {
		const fullUrl = proxy + originalUrl;
		if (Object.keys(hash).includes(originalUrl)) {
			return;
		}
		const newImg = new Image();
		newImg.src = fullUrl;
		if (isHeader) {
			newImg.onload = () => {
				getStore().dispatch(addImageLink(originalUrl, false));
			};
		}
		newImg.onerror = () => {
			const newOriginalImg = new Image();
      newOriginalImg.src = originalUrl;
      newOriginalImg.onload = () => {
      	getStore().dispatch(addImageLink(originalUrl, true));
      };
			newOriginalImg.onerror = () =>  {
				getStore().dispatch(addImageLink(originalUrl, true, true));
      }

		};
		hash[originalUrl] = newImg;
	}

}

export default ImagesService;