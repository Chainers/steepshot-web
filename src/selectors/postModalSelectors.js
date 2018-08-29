import { createSelector } from "reselect";
import Constants from "../common/constants";

const postsSelector = state => state.posts;
export const postModalSelector = state => state.postModal;
export const gallerySelector = state => state.imagesGallery;
const screenWidthSelector = state => state.window.width;
const screenHeightSelector = state => state.window.height;
export const postIndexSelector = createSelector(
  [postModalSelector],
  postModal => postModal.currentIndex
);

export const postSelector = createSelector(
  [postsSelector, postIndexSelector],
  (posts, index) => posts[index] || {}
);

export const isFullScreenModSelector = createSelector(
  [postModalSelector],
  postModal => postModal.fullScreenMode
);

export const imagesSelector = createSelector(
  [postSelector, screenWidthSelector],
  (post, screenWidth = 1024) => {
    const images = [];
    if (!post.media) {
      return images;
    }
    const media = post.media;
    if (
      screenWidth <= 1024 &&
      media["thumbnails"] &&
      media["thumbnails"][1024]
    ) {
      for (let i = 0; i < media.length; i++) {
        images.push({ url: media[i]["thumbnails"][1024] });
      }
    } else {
      for (let i = 0; i < media.length; i++) {
        images.push({ url: media[i].url });
      }
    }
    return images;
  }
);

export const imageSizeSelector = createSelector(
  [
    postSelector,
    screenWidthSelector,
    screenHeightSelector,
    isFullScreenModSelector
  ],
  (post, screenWidth, screenHeight, isFullScreenMod) => {
    const MIN_WIDTH = Constants.IMAGE.DISPLAY.MIN_WIDTH;
    const MIN_HEIGHT = Constants.IMAGE.DISPLAY.MIN_HEIGHT;
    const MARGIN = 125;
    const DETAILS_WIDTH = isFullScreenMod ? 0 : 380;
    const MAX_WIDTH = Math.min(
      Constants.IMAGE.DISPLAY.MAX_WIDTH,
      screenWidth - MARGIN * 2 - DETAILS_WIDTH
    );
    const MAX_HEIGHT = Math.min(
      Constants.IMAGE.DISPLAY.MAX_HEIGHT,
      screenHeight * 0.9
    );
    const imageSize = { ...post["image_size"] };

    const RATIO_MAX = MAX_WIDTH / MAX_HEIGHT;
    const RATIO_MIN = MIN_HEIGHT / MIN_HEIGHT;
    const RATIO_IMAGE = imageSize.width / imageSize.height;

    console.log(MAX_WIDTH);
    console.log(MAX_HEIGHT);
    console.log("_______");
    if (imageSize.width < MIN_WIDTH || imageSize.height < MIN_HEIGHT) {
      const deltaMin = RATIO_MIN - RATIO_IMAGE;
      if (deltaMin < 0) {
        imageSize.width *= MIN_HEIGHT / imageSize.height;
        imageSize.height = MIN_HEIGHT;
      } else {
        imageSize.height *= MIN_WIDTH / imageSize.width;
        imageSize.width = MIN_WIDTH;
      }
    }

    if (imageSize.width > MAX_WIDTH || imageSize.height > MAX_HEIGHT) {
      const deltaMax = RATIO_MAX - RATIO_IMAGE;
      console.log(deltaMax);
      if (deltaMax < 0) {
        imageSize.height *= MAX_WIDTH / imageSize.width;
        imageSize.width = MAX_WIDTH;
      } else {
        imageSize.width *= MAX_HEIGHT / imageSize.height;
        imageSize.height = MAX_HEIGHT;
      }
    }

    return imageSize;
  }
);

const activeIndexSelector = createSelector([gallerySelector], gallery => {
  return gallery.activeIndex;
});

export const imageUrlSelector = createSelector(
  [imagesSelector, activeIndexSelector],
  (images, activeIndex) => !!images[activeIndex] && images[activeIndex].url
);

export const postTitleSelector = createSelector([postSelector], post => {
  return (!!post && post.title) || "Image isn't found";
});

export const imagesLoadSelector = (state, imageUrl) =>
  state.imagesLoad[imageUrl] || { loaded: false, hasError: false };
