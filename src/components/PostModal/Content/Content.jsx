import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import LowNSF from "../LowNSF";
import { setFullScreen, setPostModalOptions } from "../../../actions/postModal";
import CopyLink from "../CopyLink/CopyLink";
import { copyToClipboard } from "../../../actions/clipboard";
import {
  isMobileSize,
  isSinglePost,
  postModalSelector,
  postSelector
} from "../../../selectors/postModalSelectors";
import Gallery from "../../Gallery/Gallery";
import ChainService from "../../../services/ChainService";
import Constants from "../../../common/constants";
import is from "styled-is";

const CopyLinkButton = styled(CopyLink)`
  opacity: 0;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;
  transition: 0.2s;
`;

const ToggleFullScreen = styled.div`
  opacity: 0;
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 38px;
  height: 38px;
  border-radius: 4px;
  cursor: pointer;
  background: #000000 url("/images/shape.svg") no-repeat center;
  background-size: 18px 18px;
  &:hover {
    background-size: 22px 22px;
  }

  ${is("fullScreenMode")`
      background-image: url("/images/shape-copy-6.svg");
  `};
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:hover > ${CopyLinkButton}, &:hover > ${ToggleFullScreen} {
    opacity: 1;
  }
`;

class Content extends Component {
  constructor() {
    super();
    this.copyLinkToClipboard = this.copyLinkToClipboard.bind(this);
  }

  copyLinkToClipboard() {
    this.props.copyToClipboard(this.props.post);
  }

  render() {
    const {
      isNsfw,
      showAll,
      isLowRated,
      showAllContent,
      fullScreenMode,
      hideFullScreen,
      showFullScreen,
      showToggleButton
    } = this.props;
    return (
      <Wrapper>
        <Gallery />
        <LowNSF
          fullScreenMode={fullScreenMode}
          isNsfw={isNsfw}
          isLowRated={isLowRated}
          showAll={showAll}
          setShowAll={showAllContent}
        />
        <CopyLinkButton onClick={this.copyLinkToClipboard} />
        {showToggleButton && (
          <ToggleFullScreen
            fullScreenMode={fullScreenMode}
            onClick={fullScreenMode ? hideFullScreen : showFullScreen}
          />
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  const post = postSelector(state);
  const postModal = postModalSelector(state);
  return {
    isNsfw: !!post["is_nsfw"],
    isLowRated: !!post["is_low_rated"],
    showAll: !!postModal.showAll,
    fullScreenMode: !!postModal.fullScreenMode,
    post,
    showToggleButton: !isSinglePost(state) && !isMobileSize(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    showAllContent: () => {
      dispatch(setPostModalOptions({ showAll: true }));
    },
    showFullScreen: () => {
      dispatch(setFullScreen(true));
    },
    hideFullScreen: () => {
      dispatch(setFullScreen(false));
    },
    copyToClipboard: post => {
      const text =
        document.location.origin +
        (ChainService.usingGolos() ? "/" + Constants.SERVICES.golos.name : "") +
        "/post" +
        post.url.replace(/\/[\w-.]+/, "");

      dispatch(copyToClipboard(text));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
