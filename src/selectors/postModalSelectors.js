import { createSelector } from "reselect";
import Constants from "../common/constants";

const postsSelector = state => state.posts;
const screenWidthSelector = state => state.window.width;
const screenHeightSelector = state => state.window.height;
export const postModalSelector = state => state.postModal;
export const modalPointSelector = state => state.postModal.point;
export const gallerySelector = state => state.imagesGallery;
export const isMobileSize = state =>
  state.window.width <= Constants.WINDOW.MOBILE_START_WIDTH;

export const postIndexSelector = createSelector(
  [postModalSelector],
  postModal => postModal.currentIndex
);
export const isSinglePost = state =>
  state.router.location.pathname.includes("/post/@");

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
    isFullScreenModSelector,
    isMobileSize,
    isSinglePost
  ],
  (
    post,
    screenWidth,
    screenHeight,
    isFullScreenMod,
    isMobileSize,
    isSinglePost
  ) => {
    const HEADER_HEIGHT = 60;
    const FOOTER_HEIGHT = 60;
    const MARGIN = 125;
    const DETAILS_WIDTH = isFullScreenMod ? 0 : 380;
    let minWidth = Constants.IMAGE.DISPLAY.MIN_WIDTH;
    let minHeight = Constants.IMAGE.DISPLAY.MIN_HEIGHT;
    let maxWidth = Math.min(
      Constants.IMAGE.DISPLAY.MAX_WIDTH,
      screenWidth - MARGIN * 2 - DETAILS_WIDTH
    );
    let maxHeight = Math.min(
      Constants.IMAGE.DISPLAY.MAX_HEIGHT,
      screenHeight * 0.9 - (isSinglePost ? HEADER_HEIGHT + FOOTER_HEIGHT : 0)
    );

    if (isMobileSize) {
      minWidth = screenWidth;
      minHeight = 100;
      maxWidth = screenWidth;
      maxHeight = Constants.IMAGE.DISPLAY.MAX_HEIGHT;
    }

    const imageSize = { ...post["image_size"] };

    const RATIO_MAX = maxWidth / maxHeight;
    const RATIO_MIN = minHeight / minHeight;
    const RATIO_IMAGE = imageSize.width / imageSize.height;

    if (imageSize.width < minWidth || imageSize.height < minHeight) {
      const deltaMin = RATIO_MIN - RATIO_IMAGE;
      if (deltaMin < 0) {
        imageSize.width *= minHeight / imageSize.height;
        imageSize.height = minHeight;
      } else {
        imageSize.height *= minWidth / imageSize.width;
        imageSize.width = minWidth;
      }
    }

    if (imageSize.width > maxWidth || imageSize.height > maxHeight) {
      const deltaMax = RATIO_MAX - RATIO_IMAGE;
      if (deltaMax < 0) {
        imageSize.height *= maxWidth / imageSize.width;
        imageSize.width = maxWidth;
      } else {
        imageSize.width *= maxHeight / imageSize.height;
        imageSize.height = maxHeight;
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
