const hash = {};

class ImagesService {

  static getImagesWithProxy(dataUrl, proxy) {
    const fullUrl = proxy + dataUrl;
    if (Object.keys(hash).includes(fullUrl)) {
      return hash[fullUrl];
    }
    const newImg = new Image();
    newImg.src = fullUrl;
    newImg.onerror = () => {
      newImg.src = dataUrl;
      newImg.onerror = undefined;
    };
    hash[dataUrl] = newImg;
    return newImg;
  }
}

export default ImagesService;