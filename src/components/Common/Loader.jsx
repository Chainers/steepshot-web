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
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  animation: spin 2s linear infinite;
`;

class Loader extends Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    show: PropTypes.bool,
    position: PropTypes.string,
    size: PropTypes.number
  };

  static defaultProps = {
    width: "100%",
    height: "100%",
    show: true,
    position: "absolute",
    size: 40
  };

  render() {
    return (
      <Wrapper
        className={"centered--flex " + (this.props.className || "")}
        width={this.props.width}
        height={this.props.height}
        show={this.props.show}
        position={this.props.absolute}
      >
        <Spinner size={this.props.size} />
      </Wrapper>
    );
  }
}

export default Loader;
