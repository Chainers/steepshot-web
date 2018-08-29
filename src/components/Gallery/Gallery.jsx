import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Navigation from "./Navigation/Navigation";
import { clearGalleryState, setActiveImage } from "../../actions/imagesGallery";
import {
  gallerySelector,
  imagesLoadSelector,
  imagesSelector,
  imageUrlSelector,
  postTitleSelector
} from "../../selectors/postModalSelectors";
import { imageLoadError, imageLoadSuccess } from "../../actions/images";
import Loader from "../Common/Loader";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: ${({ imageLoaded }) => (imageLoaded ? "block" : "none")};
`;

const ImageNotFound = styled.div`
  margin: 0;
  color: #000000;
  font: 27px OpenSans-Light;
`;

class Gallery extends React.Component {
  constructor() {
    super();
    this.loadedImageError = this.loadedImageError.bind(this);
    this.loadedImage = this.loadedImage.bind(this);
  }

  componentWillUnmount() {
    this.props.clearGalleryState();
  }

  loadedImageError() {
    this.props.imageLoadedError(this.props.imageUrl);
  }

  loadedImage() {
    this.props.imageLoadedSuccess(this.props.imageUrl);
  }

  render() {
    const {
      images,
      activeIndex,
      imageUrl,
      title,
      hasError,
      imageLoaded
    } = this.props;

    return (
      <Wrapper className="centered--flex">
        <Navigation
          images={images}
          activeIndex={activeIndex}
          show={images.length > 1}
          swapTo={this.props.setActiveIndex}
        />
        {!hasError &&
          imageUrl && (
            <Image
              src={imageUrl}
              alt={title}
              ref={ref => (this.image = ref)}
              onError={this.loadedImageError}
              onLoad={this.loadedImage}
              imageLoaded={imageLoaded}
            />
          )}
        {imageLoaded &&
          hasError && (
            <ImageNotFound className="centered--flex">
              Sorry, image isn't found.
            </ImageNotFound>
          )}
        {!imageLoaded && <Loader />}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  const imageUrl = imageUrlSelector(state);
  const { activeIndex } = gallerySelector(state);
  const { loaded, hasError } = imagesLoadSelector(state, imageUrl);
  return {
    images: imagesSelector(state),
    activeIndex,
    imageUrl,
    title: postTitleSelector(state),
    hasError,
    imageLoaded: loaded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    imageLoadedError: imageUrl => {
      dispatch(imageLoadError(imageUrl));
    },
    imageLoadedSuccess: imageUrl => {
      dispatch(imageLoadSuccess(imageUrl));
    },
    setActiveIndex: index => {
      dispatch(setActiveImage(index));
    },
    clearGalleryState: () => {
      dispatch(clearGalleryState());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Gallery);
