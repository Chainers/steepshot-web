import React from 'react';
import Constants from '../../../common/constants';
import ShowIf from '../ShowIf';

// const Avatar = ({src, style = {}}) => {
//   const stylesPic = Object.assign({}, style, {
//     backgroundImage : 'url(' + src + ')'
//   });
//   const stylesError = Object.assign({}, style, {
//     backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
//   });
//
//   return (
//     <div className="position--relative">
//       <div className="pic_ava-com" style={stylesError}>
//         <div className="pic_ava-com" style={stylesPic}/>
//       </div>
//     </div>
//   )
// };

class Avatar extends React.Component {
  static defaultProps = {
    style: {}
  };
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.powerIndicator();
  }

  componentWillReceiveProps() {
    this.powerIndicator();
  }

  pic() {
    return Object.assign({}, this.props.style, {
             backgroundImage : 'url(' + this.props.src + ')'
           });
  }

  picError() {
    return Object.assign({}, this.props.style, {
             backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
           });
  }

  powerIndicator() {
    if (this.canvas) {
      let ctx = this.canvas.getContext('2d');
      let ratio = window.devicePixelRatio;
      this.canvas.width = 110 * ratio;
      this.canvas.height = 110 * ratio;
      ctx.scale(ratio, ratio);
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.arc(55, 55, 53, (this.props.voting_power / 50) * Math.PI, 0, true);
      ctx.lineWidth = 3;
      let grad = ctx.createLinearGradient(50, 50, 150, 150);
      grad.addColorStop(0.0,'#ff7700');
      grad.addColorStop(0.5,'#ff1000');
      ctx.strokeStyle = grad;
      ctx.stroke();
    }
  }

  render() {
    return (
      <div className="position--relative">
        <ShowIf show={this.props.powerIndicator}>
          <canvas ref={ref => {this.canvas = ref}} className="border-indicator_ava-com"/>
        </ShowIf>
        <div className="pic_ava-com" style={this.picError()}>
          <div className="pic_ava-com" style={this.pic()}/>
        </div>
      </div>
    )
  }
}

export default Avatar;
