import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  isFullScreenModSelector,
  postModalSelector
} from "../../selectors/postModalSelectors";
import is from "styled-is";

const Wrapper = styled.div``;

const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);

  ${is("fullScreenMode")`
    background-color: rgba(0, 0, 0);
 `};
`;

class PostModal extends Component {
  render() {
    const { fullScreenMode } = this.props;

    return (
      <Wrapper>
        <Background fullScreenMode={fullScreenMode} />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    fullScreenMode: isFullScreenModSelector(state)
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostModal);
