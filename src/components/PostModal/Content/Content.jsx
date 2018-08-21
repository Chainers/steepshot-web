import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import PropTypes from "prop-types";

const Wrapper = styled.div``;

class Content extends Component {
  static propTypes = {};

  static defaultProps = {};

  render() {
    return <Wrapper />;
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch, props) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Content);
