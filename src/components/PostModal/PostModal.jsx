import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  imageSizeSelector,
  isFullScreenModSelector,
  isMobileSize,
  modalPointSelector,
  postSelector
} from "../../selectors/postModalSelectors";
import is from "styled-is";
import Content from "./Content";
import Constants from "../../common/constants";
import NavigationPostModal from "./NavigationPostModal";
import Header from "./Header";
import { closeModal } from "../../actions/modal";

const Wrapper = styled.div`
  display: table-cell;

  ${is("isMobileSize")`
    display: block;
    min-height: 100vh;
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
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.closeModal(this.props.modalPoint);
  }

  render() {
    const { fullScreenMode, imageSize, isMobileSize, post } = this.props;

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
          <Header post={post} closeModal={this.closeModal} />
          <DetailsWrapper
            height={imageSize.height}
            fullScreenMode={fullScreenMode}
            isMobileSize={isMobileSize}
          />
        </PostWrapper>
        <NavigationPostModal />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullScreenMode: isFullScreenModSelector(state),
    imageSize: imageSizeSelector(state),
    isMobileSize: isMobileSize(state),
    post: postSelector(state),
    modalPoint: modalPointSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    closeModal: modalPoint => {
      dispatch(closeModal(modalPoint));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostModal);
