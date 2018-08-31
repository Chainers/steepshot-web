import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Constants from "../../common/constants";

const Image = styled.div`
		position: relative;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    overflow: hidden;
    background: url('${({ proxyUrl }) => proxyUrl}') no-repeat center, 
      url('${({ originUrl }) => originUrl}') no-repeat center, 
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

  getProxyUrl() {
    const host = Constants.IMAGE_SERVICE.HOST;
    const scale = Constants.IMAGE_SERVICE.SCALE;

    let loadSize = 200;
    if (this.props.size > 100) {
      loadSize = this.props.size * scale;
    }
    const proxy = `${host}${loadSize}x${loadSize}/`;
    return proxy + this.props.src;
  }

  render() {
    const { className, src, size, defaultUrl } = this.props;
    return (
      <Image
        className={className}
        proxyUrl={this.getProxyUrl()}
        originUrl={src}
        size={size}
        defaultUrl={defaultUrl}
      />
    );
  }
}

export default ImageWithProxy;
