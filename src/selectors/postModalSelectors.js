import { createSelector } from "reselect";

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
    const imageSize = post["image_size"];
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
