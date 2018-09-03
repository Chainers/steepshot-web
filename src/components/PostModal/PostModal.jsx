import React, { Component, Fragment } from "react";
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
import Details from "./Details";

const ContentWrapper = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  min-width: ${Constants.IMAGE.DISPLAY.MIN_WIDTH}px;
  min-height: ${Constants.IMAGE.DISPLAY.MIN_HEIGHT}px;
  background: #e7e7e7;
  grid-area: content;

  ${is("isMobileSize")`
    min-height: auto;
  `};
`;

const HeaderWrapper = styled(Header)`
  grid-area: header;
`;

const DetailsWrapper = styled(Details)`
  grid-area: details;

  ${is("fullScreenMode")`
    display: none;  
  `};
`;

const PostWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 380px;
  grid-template-rows: 60px auto;

  grid-template-areas:
    "content header"
    "content details";

  border-radius: 10px;
  overflow: hidden;

  ${is("isMobileSize")`
      grid-template-columns: 1fr;
      grid-template-rows: 60px auto 1fr;
      grid-template-areas: 
        "header"
        "content"
        "details";
      
      min-height: 100vh;
      border-radius: 0;
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
      <Fragment>
        <PostWrapper isMobileSize={isMobileSize}>
          <ContentWrapper
            width={imageSize.width}
            height={imageSize.height}
            isMobileSize={isMobileSize}
          >
            <Content />
          </ContentWrapper>
          <HeaderWrapper post={post} closeModal={this.closeModal} />
          <DetailsWrapper
            fullScreenMode={fullScreenMode}
            postIndex={post.url}
          />
        </PostWrapper>
        <NavigationPostModal />
      </Fragment>
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
