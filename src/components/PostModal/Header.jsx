import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import TimeAgo from "timeago-react";
import PostContextMenu from "../PostContextMenu/PostContextMenu";
import Avatar from "../Common/Avatar";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 0 20px;
  background-color: #ffffff;
`;

const LeftBlock = styled(Link)`
  color: #0f181e;
  overflow: hidden;
  line-height: 20px;
  display: flex;
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: 0.2s all ease;
`;

const RightBlock = styled.div`
  display: flex;
  align-items: center;
  color: #979b9e;
  font-size: 12px;
  line-height: 22px;
`;

const Time = styled(TimeAgo)`
  margin-right: 10px;
`;

const ContextMenu = styled(PostContextMenu)`
  height: 22px;
  width: 22px;
  margin-right: 10px;
`;

const CloseButton = styled.div`
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CloseButtonIcon = styled.div`
  width: 12px;
  height: 12px;
  background: url(/images/sprite_svg1910.svg) no-repeat 3% 99.8%;
`;

class Header extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    post: PropTypes.shape({
      created: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { className, post, closeModal } = this.props;
    return (
      <Wrapper className={className}>
        <LeftBlock to={post.url}>
          <Avatar src={post.avatar} size={20} />
          <UserName>{post.author}</UserName>
        </LeftBlock>
        <RightBlock>
          <Time datetime={post.created} locale="en_US" />
          <ContextMenu item={post} index={post.url} />
          <CloseButton onClick={closeModal}>
            <CloseButtonIcon />
          </CloseButton>
        </RightBlock>
      </Wrapper>
    );
  }
}

export default Header;
