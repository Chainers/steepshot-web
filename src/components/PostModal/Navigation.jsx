import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  isFullScreenModSelector,
  postSelector
} from "../../selectors/postModalSelectors";
import HelpPanel from "./HelpPanel";

const Wrapper = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
`;

const Arrow = styled.div`
  position: absolute;
  top: 50%;
  width: 70px;
  height: 70px;
  cursor: pointer;
  border-radius: 50%;
  transform: translateY(-50%);

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
`;

const CloseButton = styled.div`
  width: 18px;
  height: 18px;
  background: url(/images/sprite_svg1910.svg) 8% 16.7% no-repeat;

  &:hover {
    background: url(/images/sprite_svg1910.svg) 6% 12.3% no-repeat;
  }
`;

class Navigation extends Component {
  render() {
    return (
      <Wrapper>
        <CloseButtonWrapper>
          <CloseButton />
        </CloseButtonWrapper>
        <LeftArrow />
        <RightArrow />
        <HelpBlock voteLoading={true} vote={false} />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    fullScreenMode: isFullScreenModSelector(state),
    post: postSelector(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    next: () => {},
    prev: () => {},
    close: () => {}
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);
