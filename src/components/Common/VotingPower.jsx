import React from "react";
import { connect } from "react-redux";
import ShowIf from "./ShowIf";
import Avatar from "./Avatar";
import * as ReactDOm from "react-dom";
import styled from "styled-components";
import Constants from "../../common/constants";

const Tip = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #f7f7f7;
  text-align: center;
  opacity: 0;
  z-index: 1;

  transition: opacity 4s ease-in;
`;

const Wrapper = styled.div`
  position: relative;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover > ${Tip} {
    opacity: 1;
    transition: opacity 0ms;
  }
`;

const Canvas = styled.canvas`
  position: absolute;
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

class VotingPower extends React.Component {
  static defaultProps = {
    style: {},
    headerAvatar: false
  };

  componentDidMount() {
    this.renderCircle(this.props.votingPower);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.votingPower !== this.props.votingPower) {
      this.renderCircle(nextProps.votingPower);
    }
  }

  renderCircle(votingPower) {
    const { size, headerAvatar } = this.props;
    let ctx = this.canvas.getContext("2d");
    let ratio = window.devicePixelRatio;
    this.canvas.width = size * ratio;
    this.canvas.height = size * ratio;
    const coords = this.props.size / 2;
    const radius = this.props.size / 2 - 2;
    const lineWidth = headerAvatar ? 2 : 3;
    const gradStart = size / 3;
    const gradEnd = size;
    ctx.scale(ratio, ratio);

    ctx.beginPath();
    ctx.arc(coords, coords, radius, 2 * Math.PI, 0);
    ctx.strokeStyle = headerAvatar ? "rgba(0,0,0,0)" : "#d1d5d8";
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.arc(coords, coords, radius, (votingPower / 50) * Math.PI, 0, true);
    ctx.lineWidth = lineWidth;

    let grad = ctx.createLinearGradient(gradStart, gradStart, gradEnd, gradEnd);
    grad.addColorStop(0.1, "#ff7700");
    grad.addColorStop(0.5, "#ff1000");
    ctx.strokeStyle = grad;
    ctx.stroke();
  }

  render() {
    const { size } = this.props;
    return (
      <Wrapper size={size}>
        <Canvas ref={ref => (this.canvas = ReactDOm.findDOMNode(ref))} />
        <ShowIf show={!this.props.headerAvatar}>
          <Tip className="prevent--selection">
            Power of like: {this.props.votingPower}%
          </Tip>
        </ShowIf>
        <Avatar
          src={this.props.src}
          size={this.props.size - 10}
          defaultUrl={Constants.NO_AVATAR}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    src: props.src,
    votingPower: state.auth.voting_power
  };
};

export default connect(mapStateToProps)(VotingPower);
