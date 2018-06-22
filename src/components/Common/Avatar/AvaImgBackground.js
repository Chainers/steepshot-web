import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../../common/constants';

class AvaImgBackground extends React.Component {

  static defaultProps = {
    style: {}
  };

  pic() {
    return Object.assign({}, this.props.style, {
      backgroundImage: 'url(' + this.props.imageUrl + ')'
    });
  }

  picError() {
    return Object.assign({}, this.props.style, {
      backgroundImage: 'url(' + Constants.NO_AVATAR + ')'
    });
  }

  render() {
    return (
      <div className="pic_ava-com" style={this.picError()}>
        <div className="pic_ava-com" style={this.pic()}/>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  let imageUrl;
  let image = state.images[props.src];
  if (image) {
    imageUrl = image[props.sizes];
  }
  return {
    imageUrl
  }
};

export default connect(mapStateToProps)(AvaImgBackground);
