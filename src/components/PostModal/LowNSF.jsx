import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ShowIf from "../Common/ShowIf";
import { CancelButton } from "../Common/Button";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ fullScreenMode }) =>
    fullScreenMode ? "rgba(0, 0, 0, .96)" : "rgba(255, 255, 255, .96)"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.p`
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  font: 27px OpenSans-Light;
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#ffffff" : "#000000")};
`;

const Description = styled.p`
  width: 100%;
  padding: 0 10%;
  margin-bottom: 30px;
  font: 14px OpenSans-Regular;
  text-align: center;
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#f3f3f2" : "#696969")};
`;

const ShowButton = CancelButton.extend`
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#ffffff" : "#000000")};
  background-color: ${({ fullScreenMode }) =>
    fullScreenMode ? "rgba(0, 0, 0, .96)" : "rgba(255, 255, 255, .96)"};

  box-shadow: none;
  &:hover,
  &:focus,
  &:active {
    box-shadow: none;
    color: ${({ fullScreenMode }) => (fullScreenMode ? "#000000" : "#e74800")};
    background-color: rgba(255, 255, 255, 0.96);
  }
`;

class LowNSF extends Component {
  static propTypes = {
    fullScreenMode: PropTypes.bool.isRequired,
    isNsfw: PropTypes.bool.isRequired,
    isLowRated: PropTypes.bool.isRequired,
    showAll: PropTypes.bool.isRequired,
    setShowAll: PropTypes.func.isRequired
  };

  render() {
    const {
      isNsfw,
      isLowRated,
      setShowAll,
      fullScreenMode,
      showAll
    } = this.props;

    if (showAll || (!isNsfw && !isLowRated)) {
      return null;
    }

    const showNsfw = isNsfw;
    const showLowRated = !isNsfw && isLowRated;

    return (
      <Wrapper fullScreenMode={fullScreenMode}>
        <ShowIf show={showNsfw}>
          <Title fullScreenMode={fullScreenMode}>NSFW content</Title>
          <Description fullScreenMode={fullScreenMode}>
            This content is for adults only. Not recommended for children or
            sensitive individuals.
          </Description>
        </ShowIf>

        <ShowIf show={showLowRated}>
          <Title fullScreenMode={fullScreenMode}>Low rated content</Title>
          <Description fullScreenMode={fullScreenMode}>
            This content is hidden due to low ratings.
          </Description>
        </ShowIf>

        <ShowButton onCLick={setShowAll} fullScreenMode={fullScreenMode}>
          Show me
        </ShowButton>
      </Wrapper>
    );
  }
}

export default LowNSF;
