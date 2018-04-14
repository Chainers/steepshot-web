import React from 'react';
import {connect} from 'react-redux';
import './imagesGallery.css';
import SingleModalImage from './SingleModalImage';
import Slider from 'react-slick';
import {setGalleryImgIndex, setResizeCoverBlock} from '../../actions/imagesGallery';

class ImagesGallery extends React.Component {

  constructor(props) {
    super(props);
    this.resizeCoverBlock = this.resizeCoverBlock.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeCoverBlock);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeCoverBlock);
  }

  componentWillReceiveProps(nextProps) {
    this.slider.slickGoTo(nextProps.galleryImgIndex, true);
  }

  resizeCoverBlock() {
    clearTimeout(this.props.rcTimeout);
    let rcTimeout = setTimeout(() => {
      this.props.setResizeCoverBlock(false);
    }, 500);
    this.props.setResizeCoverBlock(true, rcTimeout);
  }

  render() {
    let arrayImageBlocks = [];
    for (let i = 0; i < this.props.images.length; i++) {
      arrayImageBlocks.push(<SingleModalImage url={this.props.images[i].url}
                                              post={this.props.post}
                                              styles={this.props.styles}
                                              isFullScreen={this.props.isFullScreen}
                                              setComponentSize={this.props.setComponentSize}
                                              key={this.props.images[i].url}/>);
    }
    let settings = {
      dots: true,
      infinite: true,
      beforeChange: (current, next) => this.props.setGalleryImgIndex(this.props.index, next)
    };
    return (
      <Slider ref={ref => this.slider = ref} {...settings}>
        {arrayImageBlocks}
      </Slider>
    );
  }
}

const mapStateToProps = (state, props) => {
  let images = [], media = state.posts[props.index].media;
  let galleryImgIndex = state.posts[props.index].imgIndex || 0;
  if (document.documentElement.clientWidth <= 1024 && media['thumbnails'] && media['thumbnails'][1024]) {
    for (let i = 0; i < media.length; i++) {
      images.push({url: media[i]['thumbnails'][1024]});
    }
  } else {
    for (let i = 0; i < media.length; i++) {
      images.push({url: media[i].url});
    }
  }
  return {
    images,
    galleryImgIndex,
    isResizeCover: state.imagesGallery.isResizeCover,
    rcTimeout: state.imagesGallery.rcTimeout
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setGalleryImgIndex: (postIndex, imgIndex) => {
      dispatch(setGalleryImgIndex(postIndex, imgIndex));
    },
    setResizeCoverBlock: (isResizeCover, rcTimeout) => {
      dispatch(setResizeCoverBlock(isResizeCover, rcTimeout));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesGallery);
