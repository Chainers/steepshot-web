import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import Constants from "../../common/constants";
import ImagesService from "../../services/ImagesService";

const Ava = styled.div`
		position: relative;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    overflow: hidden;
    border-radius: 50%;
    background: url('${({ url }) => url}') no-repeat center;
    background-size: cover;
`;

class Avatar extends Component {
  static propTypes = {
    src: PropTypes.string,
    size: PropTypes.number
  };

  static defaultProps = {
    size: Constants.DEF_AVATAR_SIZE,
    src: Constants.NO_AVATAR
  };

  constructor(props) {
    super(props);
    this.loadSmallImage(props.src, props.size);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.src !== this.props.src &&
      !nextProps.src.includes("https://steemitimages.com/")
    ) {
      this.loadSmallImage(nextProps.src, nextProps.size);
    }
  }

  loadSmallImage(src, size) {
    if (src !== Constants.NO_AVATAR) {
      ImagesService.getImagesWithProxy(src, size);
    }
  }

  render() {
    const { className, imageUrl, size } = this.props;
    return <Ava className={className} url={imageUrl} size={size} />;
  }
}

const mapStateToProps = (state, props) => {
  const processedImages = state.images[props.src];
  return {
    imageUrl: processedImages ? processedImages[props.size] : props.src
  };
};

export default connect(mapStateToProps)(Avatar);
