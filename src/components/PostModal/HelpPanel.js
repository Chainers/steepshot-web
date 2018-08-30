import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import Loader from "../Common/Loader";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 -16px;
  color: #ffffff;
  font: 12px OpenSans-Semibold;
  background: black;
  border-radius: 4px;
  padding: 8px;
`;

const BlockWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 8px;
`;

const Icon = styled.div`
  width: ${({ width }) => width}px;
  height: 22px;
  background: url(${({ url }) => url});
`;

const Text = styled.div`
  margin: 0;
  padding-left: 10px;
`;

const SmallLoader = styled(Loader).attrs({
  size: 20
})`
  & > div {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #d0021b;
    animation: spin 2s linear infinite;
  }
`;

const Block = ({ width, url, text, showLoader = false }) => (
  <BlockWrapper>
    <Icon width={width} url={url} />
    <Text>{showLoader ? <SmallLoader /> : text}</Text>
  </BlockWrapper>
);

class HelpPanel extends Component {
  static propTypes = {
    voteLoading: PropTypes.bool.isRequired,
    vote: PropTypes.bool.isRequired
  };

  render() {
    const { voteLoading, vote, className } = this.props;
    return (
      <Wrapper className={className}>
        <Block width={22} url="/images/arrow-left.svg" text="PREV" />
        <Block width={22} url="/images/arrow-right.svg" text="NEXT" />
        <Block
          width={46}
          url="/images/enter.svg"
          text={vote ? "DISLIKE" : "LIKE"}
          showLoader={voteLoading}
        />
        <Block width={26} url="/images/esc.svg" text="ESC" />
      </Wrapper>
    );
  }
}

export default HelpPanel;
