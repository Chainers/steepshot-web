import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  display: ${({ show }) => (show ? "flex" : "none")};
  position: ${({ position }) => position};
`;

const Spinner = styled.div`
  border: 5px solid #f3f3f3;
  border-radius: 50%;
  border-top: 5px solid #e74800;
  width: 40px;
  height: 40px;
  animation: spin 2s linear infinite;
`;

class Loader extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    show: PropTypes.bool,
    position: PropTypes.string
  };

  static defaultProps = {
    width: "100%",
    height: "100%",
    show: true,
    position: "absolute"
  };

  render() {
    return (
      <Wrapper
        className="centered--flex"
        width={this.props.width}
        height={this.props.height}
        show={this.props.show}
        position={this.props.absolute}
      >
        <Spinner />
      </Wrapper>
    );
  }
}

export default Loader;
