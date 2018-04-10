import React from 'react';
import {connect} from 'react-redux';
import 'react-image-gallery/styles/css/image-gallery.css';
import './imagesGallery.css';
import SingleModalImage from './SingleModalImage';
import Slider from 'react-slick';

class ImagesGallery extends React.Component {

  render() {
    let arrayImageBlocks = [];
    for (let i = 0; i < this.props.images.length; i++) {
      arrayImageBlocks.push(<SingleModalImage url={this.props.images[i].url}
                                              post={this.props.post}
                                              key={this.props.images[i].url}/>);
    }
    let settings = {
      dots: true,
      infinite: true
    };
    return (
      <Slider {...settings}>
        {arrayImageBlocks}
      </Slider>
    );
  }
}

const mapStateToProps = (state, props) => {
  let images = [], media = state.posts[props.index].media;
  for (let i = 0; i < media.length; i++) {
    images.push({
      url: media[i]['thumbnails'] ? media[i]['thumbnails'][1024] : media[i].url
    });
  }
  return {
    images
  };
};

export default connect(mapStateToProps)(ImagesGallery);
