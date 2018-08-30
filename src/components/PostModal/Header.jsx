import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "../Common/Avatar";
import TimeAgo from "timeago-react";
import PostContextMenu from "../PostContextMenu/PostContextMenu";

const Wrapper = styled.div`
  padding: 20px;
  background-color: #ffffff;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftBlock = styled(Link)`
  color: #0f181e;
  overflow: hidden;
  line-height: 20px;
  display: flex;
`;

const UserName = styled.div`
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  transition: 0.2s all ease;
  display: flex;
  align-items: center;
`;

const RightBlock = styled.div`
  display: flex;
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
  margin-right: 38px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
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
