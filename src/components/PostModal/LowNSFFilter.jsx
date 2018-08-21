import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import ShowIf from "../Common/ShowIf";

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ fullScreenMode }) =>
    fullScreenMode ? "rgba(0, 0, 0, .96)" : "rgba(255, 255, 255, .96)"};
`;

const Title = styled.p`
  margin-bottom: 20px;
  font: 27px OpenSans-Light;
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#ffffff" : "#000000")};
`;

const Description = styled.p`
  max-width: 80%;
  margin-bottom: 30px;
  font: 14px OpenSans-Regular;
  text-align: center;
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#f3f3f2" : "#696969")};
`;

const Button = styled.button`
  color: ${({ fullScreenMode }) => (fullScreenMode ? "#ffffff" : "#000000")};
  background-color: ${({ fullScreenMode }) =>
    fullScreenMode ? "rgba(0, 0, 0, .96)" : "rgba(255, 255, 255, .96)"};
`;

class LowNSFFilter extends Component {
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
      showAll,
      isLowRated,
      setShowAll,
      fullScreenMode
    } = this.props;
    const showNsfw = isNsfw && !showAll;
    const showLowRated = !isNsfw && !showAll && isLowRated;

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
        <Button
          className="btn btn-cancel"
          onCLick={setShowAll}
          fullScreenMode={fullScreenMode}
        >
          Show me
        </Button>
      </Wrapper>
    );
  }
}

export default LowNSFFilter;
