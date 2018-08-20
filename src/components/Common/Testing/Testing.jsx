import React from "react";
import styled from "styled-components";
import Gallery from "../../Gallery/Gallery";
import { connect } from "react-redux";
import { addSinglePost } from "../../../actions/post";

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
  margin-top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 1);
  width: 640px;
  height: 540px;
`;

class Testing extends React.Component {
  constructor(props) {
    super();
    props.addSinglePost("/post/@likesmylove/ngg-2018-08-03-09-13-58");
  }

  render() {
    return (
      <Wrapper>
        <Gallery index="/steepshot/@likesmylove/ngg-2018-08-03-09-13-58" />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    addSinglePost: url => {
      dispatch(addSinglePost(url));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Testing);
