import React from 'react';
import {connect} from 'react-redux';
import './imagesGallery.css';
import {setGalleryImage, setImageCompleteStatus} from '../../actions/imagesGallery';
import Constants from '../../common/constants';
import ShowIf from '../Common/ShowIf';
import {setNewImageLoading} from '../../actions/postModal';

class ImagesGallery extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (this.props.imageNumberInGallery !== nextProps.imageNumberInGallery) {
			setTimeout( () => {
				if (!this.image.complete) {
          this.props.setNewImageLoading(true);
        }
      }, 50);
    }
		if (this.props.index !== nextProps.index && this.image.complete) {
			this.props.setImageCompleteStatus(this.props.index, true);
		}
	}

  imageLoaded() {
    this.props.setPostModalSize(this.props.isFullScreen);
  }

  loadImgError() {
    this.props.setPostModalSize(this.props.isFullScreen);
  }

  setGalleryImage(newIndex) {
  	if (typeof newIndex === 'number') {
  		this.props.setGalleryImage(this.props.index, newIndex);
  		return;
    }
  	let imageNumberInGallery = this.props.imageNumberInGallery;
  	let imagesAmount = this.props.images.length;
    if (newIndex === 'next') imageNumberInGallery++;
    if (newIndex === 'prev') imageNumberInGallery--;
    if (imageNumberInGallery > imagesAmount - 1) imageNumberInGallery = 0;
    if (imageNumberInGallery < 0) imageNumberInGallery = imagesAmount - 1;
  	this.props.setGalleryImage(this.props.index, imageNumberInGallery);
	}

	renderNavigationDots() {
  	let dots = [];
  	for (let i = 0; i < this.props.images.length; i++) {
  		let dotClass = this.props.imageNumberInGallery === i ? 'nav-dot_img-gallery active-dot_img-gallery' : 'nav-dot_img-gallery';
  		dots.push(<div key={i} className="nav-dot-wrapper_img-gallery centered--flex"
										 onClick={this.setGalleryImage.bind(this, i)}>
										 <div className={dotClass}/>
								</div>);
		}
		return dots;
	}

	render() {
		let imgWidth = this.props.styles ? this.props.styles.width : null;
    let holderClass = this.props.isFullScreen ? 'before-load-full-screen_pos-mod' : 'before-load-curtain_pos-mod';
    let imgFullScreenClass = this.props.isFullScreen ? 'img-full-screen_img-gallery' : null;
    let fullScreenWrapper = this.props.isFullScreen ? 'full-screen_sin-mod-img' : null;
    return (
			<div className={fullScreenWrapper}>
				<ShowIf show={this.props.images.length > 1}>
					<div className="left-arrow_img-gallery left-right_img-gallery"
							 onClick={this.setGalleryImage.bind(this, 'prev')}/>
					<div className="right-arrow_img-gallery left-right_img-gallery"
							 onClick={this.setGalleryImage.bind(this, 'next')}/>
					<div className="nav-dots-wrapper_img-gallery">
						{this.renderNavigationDots()}
					</div>
				</ShowIf>
				<img src={this.props.images[this.props.imageNumberInGallery].url || Constants.NO_IMAGE}
						 alt={this.props.post.title}
						 className={imgFullScreenClass}
						 style={this.props.styles}
						 ref={ref => this.image = ref}
						 onLoad={this.imageLoaded.bind(this)}
						 onError={this.loadImgError.bind(this)}
				/>
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
		post,
		images,
    imageNumberInGallery: post.imageNumberInGallery || 0,
		window: state.window
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
    setGalleryImage: (postIndex, imageNumberInGallery) => {
      dispatch(setGalleryImage(postIndex, imageNumberInGallery));
    },
		setImageCompleteStatus: (postIndex, isComplete) => {
    	dispatch(setImageCompleteStatus(postIndex, isComplete));
		},
		setNewImageLoading: (isLoading) => {
    	dispatch(setNewImageLoading(isLoading));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(ImagesGallery);
