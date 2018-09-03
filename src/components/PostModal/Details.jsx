import React, { Component } from "react";
import styled from "styled-components";
import {
  imageSizeSelector,
  isFullScreenModSelector,
  isMobileSize,
  modalPointSelector,
  postSelector
} from "../../selectors/postModalSelectors";
import { connect } from "react-redux";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #ffffff;
`;

class Details extends Component {
  render() {
    const { className } = this.props;
    return <Wrapper className={className} />;
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

export default connect(mapStateToProps)(Details);
