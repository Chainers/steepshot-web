import React from "react";
import styled from "styled-components";
import Gallery from "../../Gallery/Gallery";

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  margin-top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.03);
`;

class Testing extends React.Component {
  render() {
    return (
      <Wrapper>
        <Gallery index="index" />
      </Wrapper>
    );
  }
}

export default Testing;
