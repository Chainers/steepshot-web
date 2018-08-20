import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Navigation from "./Navigation/Navigation";
import PropTypes from "prop-types";
import {
  clearGalleryState,
  imageLoaded,
  setActiveImage
} from "../../actions/imagesGallery";
import {
  activeIndexSelector,
  imageSizeSelector,
  imagesSelector,
  imageUrlSelector,
  postTitleSelector
} from "../../selectors/postModalSelectors";
import Constants from "../../common/constants";
import { imageLoadError } from "../../actions/images";

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Images = styled.img`
  max-width: calc((100vw - 380px) * 0.9);
  max-height: calc(100vh - 160px);
  object-fit: cover;
  min-width: 640px;
  min-height: 480px;
  width: ${({ width }) => width + "px"};
  height: ${({ height }) => height + "px"};
`;

class Gallery extends React.Component {
  static propTypes = {
    index: PropTypes.string.isRequired
  };

  constructor() {
    super();
    this.loadImgError = this.loadImgError.bind(this);
  }

  componentWillUnmount() {
    this.props.clearGalleryState();
  }

  loadImgError() {
    this.props.imageLoaded();
    this.props.imageLoadError(this.props.imageUrl);
  }

  render() {
    console.log(this.props);

    const { images, activeIndex, imageUrl, title, imageSize } = this.props;

    return (
      <Wrapper>
        <Navigation
          images={images}
          activeIndex={activeIndex}
          show={images.length > 1}
          swapTo={this.props.setActiveIndex}
        />
        <Images
          src={imageUrl || Constants.NO_IMAGE}
          alt={title}
          ref={ref => (this.image = ref)}
          onError={this.loadImgError}
          onLoad={this.props.imageLoaded}
        />
      </Wrapper>
    );
  }
}

const stateM = {
  posts: {
    index: {
      media: [
        {
          ipfs_hash: "QmS9UXKaoNS9dA7X6RAL9wsKckDjpov5UtAXrCYgro7KDo",
          size: { height: 1080, width: 1080 },
          thumbnails: {
            256: "http://steepshot.org/api/v1/image/787edc99-67e7-46bf-8293-047adca38228.jpeg",
            1024: "http://steepshot.org/api/v1/image/f77c9845-0fd2-4067-b32b-1552b458eed9.jpeg"
          },
          url:
            "http://steepshot.org/api/v1/image/5ab2191b-40b1-4c41-aab4-21812157e0ff.jpeg"
        },
        {
          ipfs_hash: "QmeZAQj4pnsU1cd18JagWjJKQCV3Ds9bAkwb2S5FyWURN7",
          size: { height: 1080, width: 1080 },
          thumbnails: {
            256: "http://steepshot.org/api/v1/image/215f80b2-a3dd-44db-9068-9a02fbf6627e.jpeg",
            1024: "http://steepshot.org/api/v1/image/22efcaf9-992d-4285-8962-3fa81130f6d9.jpeg"
          },
          url:
            "http://steepshot.org/api/v1/image/57ea5bad-38ec-4ad6-8008-53291aa48875.jpeg"
        }
      ],
      image_size: { height: 1080, width: 1080 },
      title: "title"
    }
  },
  window: { width: 1030 },
  imagesGallery: {
    activeIndex: 0,
    imageLoading: true
  }
};

const mapStateToProps = (state, props) => {
  const imageUrl = imageUrlSelector(stateM, props.index);
  return {
    images: imagesSelector(stateM, props.index),
    activeIndex: activeIndexSelector(stateM, props.index),
    imageUrl,
    title: postTitleSelector(stateM, props.index),
    imageSize: imageSizeSelector(stateM, props.index)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    imageLoadError: imageUrl => {
      dispatch(imageLoadError(imageUrl));
    },
    imageLoaded: () => {
      dispatch(imageLoaded());
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
