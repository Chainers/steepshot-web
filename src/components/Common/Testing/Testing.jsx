import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { addSinglePost } from "../../../actions/post";
import PostModal from "../../PostModal/PostModalNew";
import { postSelector } from "../../../selectors/postModalSelectors";

const Wrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
`;

class Testing extends React.Component {
  constructor(props) {
    super();
    props.addSinglePost("/post/@likesmylove/ngg-2018-08-03-09-13-58");
  }

  render() {
    if (!this.props.post.url) {
      return null;
    }
    return (
      <Wrapper>
        <PostModal />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    post: postSelector(state)
  };
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
