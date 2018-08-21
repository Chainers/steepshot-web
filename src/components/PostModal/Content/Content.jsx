import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import LowNSF from "../LowNSF";
import { setPostModalOptions } from "../../../actions/postModal";
import CopyLink from "../CopyLink/CopyLink";
import { copyToClipboard } from "../../../actions/clipboard";
import { postSelector } from "../../../selectors/postModalSelectors";
import Gallery from "../../Gallery/Gallery";
import ChainService from "../../../services/ChainService";
import Constants from "../../../common/constants";

const CopyLinkButton = styled(CopyLink)`
  opacity: 0;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;
  transition: 0.2s;
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  &:hover > ${CopyLinkButton} {
    opacity: 1;
  }
`;

class Content extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor() {
    super();
    this.copyLinkToClipboard = this.copyLinkToClipboard.bind(this);
  }

  copyLinkToClipboard() {
    this.props.copyToClipboard(this.props.post);
  }

  render() {
    const {
      index,
      isNsfw,
      showAll,
      isLowRated,
      showAllContent,
      fullScreenMode
    } = this.props;
    return (
      <Wrapper>
        <Gallery index={index} />
        <LowNSF
          fullScreenMode={fullScreenMode}
          isNsfw={isNsfw}
          isLowRated={isLowRated}
          showAll={showAll}
          setShowAll={showAllContent}
        />
        <CopyLinkButton onClick={this.copyLinkToClipboard} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    isNsfw: false,
    isLowRated: true,
    showAll: false,
    fullScreenMode: true,
    post: postSelector(state, props.index)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    showAllContent: () => {
      dispatch(setPostModalOptions({ showAll: true }));
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
