import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  isFullScreenModSelector,
  isMobileSize,
  modalPointSelector,
  postIndexSelector,
  postSelector
} from "../../selectors/postModalSelectors";
import HelpPanel from "./HelpPanel";
import {
  nextPostModal,
  previousPostModal,
  setFullScreen
} from "../../actions/postModal";
import { toggleVote } from "../../actions/vote";
import { closeModal } from "../../actions/modal";
import is from "styled-is";

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-radius: 50%;
  transform: translateY(-50%);
  transition: all 0.2s;

  ${is("hide")`
    opacity: 0;
  `};

  &:hover {
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const LeftArrow = Arrow.extend`
  background: url("/images/arrow-modal-left.svg") center no-repeat;
  left: 10px;
`;

const RightArrow = Arrow.extend`
  background: url("/images/arrow-modal-right.svg") center no-repeat;
  right: 10px;
`;

const HelpBlock = styled(HelpPanel)`
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  transition: all 0.2s;

  ${is("hide")`
    opacity: 0;
  `};
`;

const CloseButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 23px;
  top: 14px;
  width: 38px;
  height: 38px;
  cursor: pointer;
  transition: all 0.2s;

  ${is("hide")`
    opacity: 0;
  `};
`;

const CloseButton = styled.div`
  width: 18px;
  height: 18px;
  background: url(/images/sprite_svg1910.svg) 8% 16.7% no-repeat;

  &:hover {
    background: url(/images/sprite_svg1910.svg) 6% 12.3% no-repeat;
  }
`;

const HelpBlockWrapper = styled.div``;

const HIDE_TIME = 6000;

class NavigationPostModal extends Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.keyListener = this.keyListener.bind(this);
    this.showNavigation = this.showNavigation.bind(this);
    this.hideNavigation = this.hideNavigation.bind(this);
    this.blockMouseEnter = this.blockMouseEnter.bind(this);
    this.blockMouseLeave = this.blockMouseLeave.bind(this);

    this.state = {
      hideAll: false
    };
  }

  timeout = null;

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenMode && !this.props.fullScreenMode) {
      window.addEventListener("mousemove", this.showNavigation);
    }
    if (!nextProps.fullScreenMode && this.props.fullScreenMode) {
      clearTimeout(this.timeout);
      window.removeEventListener("mousemove", this.showNavigation);
      this.setState({
        hideAll: false
      });
    }
  }

  showNavigation() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.hideNavigation, HIDE_TIME);

    if (this.state.hideAll) {
      this.setState({
        hideAll: false
      });
    }
  }

  hideNavigation() {
    this.setState({
      hideAll: true
    });
  }

  blockMouseEnter() {
    clearTimeout(this.timeout);
    window.removeEventListener("mousemove", this.showNavigation);
  }

  blockMouseLeave() {
    window.addEventListener("mousemove", this.showNavigation);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.keyListener);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.keyListener);
    clearTimeout(this.timeout);
  }

  keyListener(e) {
    switch (e.keyCode) {
      case 37:
        this.previous(e);
        break;
      case 39:
        this.next(e);
        break;
      case 27:
        if (this.props.fullScreenMode) {
          e.stopPropagation();
          this.props.hideFullScreen();
        } else {
          this.closeModal(e);
        }
        break;
      case 13:
        e.stopPropagation();
        this.props.toggleVote(this.props.currentIndex);
        break;
      default:
        break;
    }
  }

  closeModal(e) {
    e.stopPropagation();
    this.props.closeModal(this.props.modalPoint);
  }

  next(e) {
    e.stopPropagation();
    this.props.next(this.props.currentIndex);
  }

  previous(e) {
    e.stopPropagation();
    this.props.previous(this.props.currentIndex);
  }

  render() {
    const { post, fullScreenMode, isMobileSize } = this.props;
    const { hideAll } = this.state;
    return (
      <Fragment>
        <CloseButtonWrapper
          onClick={this.closeModal}
          hide={!fullScreenMode || hideAll || isMobileSize}
          onMouseEnter={this.blockMouseEnter}
          onMouseLeave={this.blockMouseLeave}
        >
          <CloseButton />
        </CloseButtonWrapper>
        <LeftArrow
          onClick={this.previous}
          hide={(fullScreenMode && hideAll) || isMobileSize}
          onMouseEnter={this.blockMouseEnter}
          onMouseLeave={this.blockMouseLeave}
        />
        <RightArrow
          onClick={this.next}
          hide={(fullScreenMode && hideAll) || isMobileSize}
          onMouseEnter={this.blockMouseEnter}
          onMouseLeave={this.blockMouseLeave}
        />
        <HelpBlockWrapper
          onMouseEnter={this.blockMouseEnter}
          onMouseLeave={this.blockMouseLeave}
        >
          <HelpBlock
            voteLoading={post.voteLoading}
            vote={post.vote}
            hide={!fullScreenMode || hideAll || isMobileSize}
          />
        </HelpBlockWrapper>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullScreenMode: isFullScreenModSelector(state),
    post: postSelector(state),
    currentIndex: postIndexSelector(state),
    modalPoint: modalPointSelector(state),
    isMobileSize: isMobileSize(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    next: currentIndex => {
      dispatch(nextPostModal(currentIndex));
    },
    previous: currentIndex => {
      dispatch(previousPostModal(currentIndex));
    },
    closeModal: modalPoint => {
      dispatch(closeModal(modalPoint));
    },
    hideFullScreen: () => {
      dispatch(setFullScreen(false));
    },
    toggleVote: postIndex => {
      dispatch(toggleVote(postIndex));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavigationPostModal);
