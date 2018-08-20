import { createSelector } from "reselect";

const postSelector = (state, index) => state.posts[index];
const gallerySelector = state => state.imagesGallery;
const screenWidthSelector = state => state.window.width;

export const imagesSelector = createSelector(
  [postSelector, screenWidthSelector],
  (post, screenWidth = 1024) => {
    const images = [];
    if (!post) {
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

export const activeIndexSelector = createSelector(
  [gallerySelector],
  gallery => {
    return gallery.activeIndex;
  }
);

export const imageUrlSelector = createSelector(
  [imagesSelector, activeIndexSelector],
  (images, activeIndex) => images[activeIndex].url
);

export const postTitleSelector = createSelector([postSelector], post => {
  return (!!post && post.title) || "Image isn't found";
});

export const imageSizeSelector = createSelector([postSelector], post => {
  return (!!post && post.image_size) || { width: 1024, height: 1024 };
});
