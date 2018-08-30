import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  display: ${({ show }) => (show ? "block" : "none")};
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Arrow = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.6;
  background: url("/images/arrow-next-gallery.svg") center no-repeat;

  &:hover {
    opacity: 1;
  }
`;

const LeftArrow = Arrow.extend`
  left: 10px;
  transform: translateY(-50%) rotate(180deg);
`;

const RightArrow = Arrow.extend`
  right: 10px;
`;

const DotsWrapper = styled.div`
  position: absolute;
  display: flex;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
`;

const DotContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const Dot = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background: #ffffff;
  opacity: ${({ active }) => (active ? 1 : 0.6)};
`;

class NavigationGallery extends Component {
  static propTypes = {
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    activeIndex: PropTypes.number.isRequired,
    show: PropTypes.bool,
    swapTo: PropTypes.func
  };

  static defaultProps = {
    show: false,
    swapTo: () => {}
  };

  constructor() {
    super();
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
  }

  next() {
    let nextIndex =
      this.props.activeIndex === this.props.images.length - 1
        ? 0
        : this.props.activeIndex + 1;
    this.props.swapTo(nextIndex);
  }

  prev() {
    let nextIndex =
      this.props.activeIndex === 0
        ? this.props.images.length - 1
        : this.props.activeIndex - 1;
    this.props.swapTo(nextIndex);
  }

  render() {
    const { images, activeIndex, show, swapTo } = this.props;
    return (
      <Wrapper show={show}>
        <LeftArrow onClick={this.prev} />
        <RightArrow onClick={this.next} />
        <DotsWrapper>
          {images.map((image, index) => (
            <DotContainer key={index} onClick={() => swapTo(index)}>
              <Dot active={index === activeIndex} />
            </DotContainer>
          ))}
        </DotsWrapper>
      </Wrapper>
    );
  }
}

export default NavigationGallery;
