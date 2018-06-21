import {getStore} from '../store/configureStore';
import {addImageLink} from '../actions/images';

const hash = {};

class ImagesService {

  static getImagesWithProxy(originalUrl, proxy) {
    const fullUrl = proxy + originalUrl;
    if (Object.keys(hash).includes(originalUrl)) {
      return;
    }
    const newImg = new Image();
    newImg.src = fullUrl;
    newImg.onload = () => {
      // getStore().dispatch(addImageLink(originalUrl, true, point));
    };
    newImg.onerror = () => {
      getStore().dispatch(addImageLink(originalUrl, false));
    };
    hash[originalUrl] = newImg;
  }

}

export default ImagesService;