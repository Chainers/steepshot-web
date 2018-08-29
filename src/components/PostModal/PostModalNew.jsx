import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  imageSizeSelector,
  isFullScreenModSelector
} from "../../selectors/postModalSelectors";
import is from "styled-is";
import Content from "./Content/Content";
import Constants from "../../common/constants";

const Wrapper = styled.div`
  display: table-cell;
`;

const PostWrapper = styled.div`
  display: flex;
  border-radius: 10px;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  min-width: ${Constants.IMAGE.DISPLAY.MIN_WIDTH}px;
  min-height: ${Constants.IMAGE.DISPLAY.MIN_HEIGHT}px;
  background: #e7e7e7;
`;

const DetailsWrapper = styled.div`
  width: 380px;
  height: ${({ height }) => height}px;
  min-height: ${Constants.IMAGE.DISPLAY.MIN_HEIGHT}px;
  background-color: black;
`;

class PostModal extends Component {
  render() {
    const { fullScreenMode, imageSize } = this.props;
    console.log(imageSize);

    return (
      <Wrapper>
        <PostWrapper>
          <ContentWrapper width={imageSize.width} height={imageSize.height}>
            <Content />
          </ContentWrapper>
          <DetailsWrapper height={imageSize.height} />
        </PostWrapper>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullScreenMode: isFullScreenModSelector(state),
    imageSize: imageSizeSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostModal);
