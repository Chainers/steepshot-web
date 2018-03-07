import React from 'react';
import Constants from '../../../common/constants';
import ShowIf from "../ShowIf";

const Avatar = ({src, style = {}}) => {
  const stylesPic = Object.assign({}, style, {
    backgroundImage : 'url(' + src + ')'
  });
  const stylesError = Object.assign({}, style, {
    backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
  });

  return (
    <div className="position--relative">
      <div className="pic_ava-com" style={stylesError}>
        <div className="pic_ava-com" style={stylesPic}/>
      </div>
    </div>
  )
};

// class Avatar extends React.Component {
//   static defaultProps = {
//     style: {}
//   };
//   constructor(props) {
//     super(props);
//   }
//
//   componentDidMount() {
//     this.powerIndicator();
//   }
//
//   componentWillReceiveProps() {
//     this.powerIndicator();
//   }
//
//   pic() {
//     return Object.assign({}, this.props.style, {
//              backgroundImage : 'url(' + this.props.src + ')'
//            });
//   }
//
//   picError() {
//     return Object.assign({}, this.props.style, {
//              backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
//            });
//   }
//
//   powerIndicator() {
//     if (this.canvas) {
//       let ctx = this.canvas.getContext('2d');
//       this.canvas.width = 110;
//       this.canvas.height = 110;
//       ctx.beginPath();
//       ctx.arc(55, 55, 53, 1.7 * Math.PI, 0, true);
//       ctx.lineWidth = 3;
//       let grad = ctx.createLinearGradient(50,50,150,150);
//       grad.addColorStop(0.0,'#ff7700');
//       grad.addColorStop(0.5,'#ff1000');
//       ctx.strokeStyle = grad;
//       ctx.stroke();
//     }
//   }
//
//   render() {
//     return (
//       <div className="position--relative">
//         <ShowIf show={this.props.powerIndicator}>
//           <canvas ref={ref => {this.canvas = ref}} className="border-indicator_ava-com"/>
//         </ShowIf>
//         <div className="pic_ava-com" style={this.picError()}>
//           <div className="pic_ava-com" style={this.pic()}/>
//         </div>
//       </div>
//     )
//   }
// }

export default Avatar;
