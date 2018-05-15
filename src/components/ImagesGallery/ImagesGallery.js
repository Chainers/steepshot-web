import React from 'react';
import {connect} from 'react-redux';
import './imagesGallery.css';
import SingleModalImage from './SingleModalImage';
import Slider from 'react-slick';
import {setGalleryImage, setGalleryImgIndex, setResizeCoverBlock} from '../../actions/imagesGallery';
import {utils} from '../../utils/utils';
import Constants from "../../common/constants";
import ShowIf from "../Common/ShowIf";
import LoadingSpinner from "../LoadingSpinner/index";
import {setFullScreen} from "../../actions/postModal";

class ImagesGallery extends React.Component {

	// componentWillReceiveProps(nextProps) {
	// 	this.slider.slickGoTo(nextProps.galleryImgIndex, true);
	// 	if (!utils.equalsObjects(nextProps.window, this.props.window) && this.props.images.length > 1) {
	// 		clearTimeout(this.props.resizeCoverTimeout);
	// 		let resizeCoverTimeout = setTimeout(() => {
	// 			this.props.setResizeCoverBlock(false);
	// 		}, 500);
	// 		this.props.setResizeCoverBlock(true, resizeCoverTimeout);
	// 	}
	// }

  imageLoaded() {
    this.props.setComponentSize();
  }

  loadImgError() {
    this.props.setComponentSize();
  }

  setGalleryImage(newIndex) {
  	if (typeof newIndex === 'number') {
  		this.props.setGalleryImage(this.props.index, newIndex);
  		return;
    }
  	let imageNumber = this.props.imageNumber;
  	let imagesAmount = this.props.images.length;
    if (newIndex === 'next') imageNumber++;
    if (newIndex === 'prev') imageNumber--;
    if (imageNumber > imagesAmount - 1) imageNumber = 0;
    if (imageNumber < 0) imageNumber = imagesAmount - 1;
  	this.props.setGalleryImage(this.props.index, imageNumber);
	}

	renderNavigationDots() {
  	let dots = [];
  	for (let i = 0; i < this.props.images.length; i++) {
  		let dotClass = this.props.imageNumber === i ? 'nav-dot_img-gallery active-dot_img-gallery' : 'nav-dot_img-gallery';
  		dots.push(<div key={i} className="nav-dot-wrapper_img-gallery centered--flex"
										 onClick={this.setGalleryImage.bind(this, i)}>
										<div className={dotClass}/>
								</div>);
		}
		return dots;
	}

	render() {
		let imgWidth = this.props.styles ? this.props.styles.width : 0;
    let holderClass = this.props.isFullScreen ? 'before-load-full-screen_pos-mod' : 'before-load-curtain_pos-mod';
    let fullScreenWrapper = this.props.isFullScreen ? 'full-screen_sin-mod-img' : null;
    return (
			<div className={fullScreenWrapper}>
				<ShowIf show={this.props.images.length > 1}>
					<div className="left-arrow_img-gallery left-right_img-gallery" onClick={this.setGalleryImage.bind(this, 'prev')}/>
					<div className="right-arrow_img-gallery left-right_img-gallery" onClick={this.setGalleryImage.bind(this, 'next')}/>
					<div className="nav-dots-wrapper_img-gallery">
						{this.renderNavigationDots()}
					</div>
				</ShowIf>
				<img src={this.props.images[this.props.imageNumber].url || Constants.NO_IMAGE}
						 alt={this.props.post.title}
						 style={this.props.styles}
						 ref={ref => this.image = ref}
						 onLoad={this.imageLoaded.bind(this)}
						 onError={this.loadImgError.bind(this)}
				/>
				<ShowIf show={!this.image || !this.image.complete}>
					<div className={holderClass} style={{width: imgWidth}}>
						<LoadingSpinner/>
					</div>
				</ShowIf>
				<ShowIf show={this.image && this.image.complete && !this.image.naturalWidth}>
					<div className={holderClass} style={{width: imgWidth, backgroundColor: this.props.isFullScreen ? '#e7e7e7' : ''}}>
						<p className="title_pos-mod">Sorry, image isn't found.</p>
					</div>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	let images = [], post = state.posts[props.index], media = post.media;
	let galleryImgIndex = post.imgIndex || 0;
	if (document.documentElement.clientWidth <= 1024 && media['thumbnails'] && media['thumbnails'][1024]) {
		for (let i = 0; i < media.length; i++) {
			images.push({url: media[i]['thumbnails'][1024]});
		}
	} else {
		for (let i = 0; i < media.length; i++) {
			images.push({url: media[i].url});
		}
	}
	let imageNumber = post.imageNumber || 0;
	return {
		images,
		galleryImgIndex,
		imageNumber,
		isResizeCover: state.imagesGallery.isResizeCover,
    resizeCoverTimeout: state.imagesGallery.resizeCoverTimeout,
		window: state.window
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setGalleryImgIndex: (postIndex, imgIndex) => {
			dispatch(setGalleryImgIndex(postIndex, imgIndex));
		},
		setResizeCoverBlock: (isResizeCover, resizeCoverTimeout) => {
			dispatch(setResizeCoverBlock(isResizeCover, resizeCoverTimeout));
		},
    setGalleryImage: (postIndex, imageNumber) => {
      dispatch(setGalleryImage(postIndex, imageNumber));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesGallery);
