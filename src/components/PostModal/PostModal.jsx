import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  imageSizeSelector,
  isFullScreenModSelector,
  isMobileSize
} from "../../selectors/postModalSelectors";
import is from "styled-is";
import Content from "./Content";
import Constants from "../../common/constants";
import Navigation from "./Navigation";

const Wrapper = styled.div`
  display: table-cell;

  ${is("isMobileSize")`
    display: block;
  `};
`;

const PostWrapper = styled.div`
  display: flex;
  border-radius: 10px;
  overflow: hidden;

  ${is("isMobileSize")`
      flex-direction: column;
      border-radius: 0;
  `};
`;

const ContentWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  min-width: ${Constants.IMAGE.DISPLAY.MIN_WIDTH}px;
  min-height: ${Constants.IMAGE.DISPLAY.MIN_HEIGHT}px;
  background: #e7e7e7;

  ${is("isMobileSize")`
    min-height: auto;
    width: 100%;
  `};
`;

const DetailsWrapper = styled.div`
  width: 380px;
  height: ${({ height }) => height}px;
  min-height: ${Constants.IMAGE.DISPLAY.MIN_HEIGHT}px;
  background-color: black;

  ${is("fullScreenMode")`
    display: none;  
  `};

  ${is("isMobileSize")`
    width: 100%;
  `};
`;

class PostModal extends Component {
  render() {
    const { fullScreenMode, imageSize, isMobileSize } = this.props;

    return (
      <Wrapper isMobileSize={isMobileSize}>
        <PostWrapper isMobileSize={isMobileSize}>
          <ContentWrapper
            width={imageSize.width}
            height={imageSize.height}
            isMobileSize={isMobileSize}
          >
            <Content />
          </ContentWrapper>
          <DetailsWrapper
            height={imageSize.height}
            fullScreenMode={fullScreenMode}
            isMobileSize={isMobileSize}
          />
        </PostWrapper>
        <Navigation />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullScreenMode: isFullScreenModSelector(state),
    imageSize: imageSizeSelector(state),
    isMobileSize: isMobileSize(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostModal);
