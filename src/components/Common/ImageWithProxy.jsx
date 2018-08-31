import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";
import Constants from "../../common/constants";
import ImagesService from "../../services/ImagesService";

const Image = styled.div`
		position: relative;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    overflow: hidden;
    background: url('${({ url }) => url}') no-repeat center, 
      url('${({ defaultUrl }) => defaultUrl}') no-repeat center;
      background-size: cover;
`;

class ImageWithProxy extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    defaultUrl: PropTypes.string
  };

  static defaultProps = {
    defaultUrl: Constants.NO_IMAGE
  };

  componentWillReceiveProps(nextProps) {
    const { imageWithProxy, src, size } = nextProps;
    if (!imageWithProxy || imageWithProxy.size < size) {
      ImagesService.getImagesWithProxy(src, size);
    }
  }

  componentDidMount() {
    const { imageWithProxy, src, size } = this.props;
    if (!imageWithProxy || imageWithProxy.size < size) {
      ImagesService.getImagesWithProxy(src, size);
    }
  }

  render() {
    const { className, imageWithProxy, size, defaultUrl } = this.props;
    console.log(imageWithProxy);
    return (
      <Image
        className={className}
        url={(imageWithProxy || {}).src}
        size={size}
        defaultUrl={imageWithProxy ? defaultUrl : null}
      />
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    imageWithProxy: state.images[props.src]
  };
};

export default connect(mapStateToProps)(ImageWithProxy);
