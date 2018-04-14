import React from 'react';
import Constants from '../../common/constants';
import './imagesGallery.css';
import ShowIf from '../Common/ShowIf';
import LoadingSpinner from '../LoadingSpinner/index';

class SingleModalImage extends React.Component {

  componentDidMount() {
    let arrows = document.getElementsByClassName('slick-arrow');
    if (arrows.length) {
      let eventArray = 'click touchend'.split(' ');
      for (let i = 0; i < eventArray.length; i++) {
        arrows[0].addEventListener(eventArray[i], (e) => {
          e.target.blur();
        });
      }
      for (let i = 0; i < eventArray.length; i++) {
        arrows[1].addEventListener(eventArray[i], (e) => {
          e.target.blur();
        });
      }
    }
  }

  imageLoaded() {
    this.props.setComponentSize();
  }

  loadImgError() {
    this.props.setComponentSize();
  }

  render() {
    let imgWidth = this.props.styles ? this.props.styles.width : 0;
    let holderClass = this.props.isFullScreen ? 'before-load-full-screen_pos-mod' : 'before-load-curtain_pos-mod';
    let fullScreenWrapper = this.props.isFullScreen ? 'full-screen_sin-mod-img' : null;
    return (
      <div className={fullScreenWrapper}>
        <img src={this.props.url || Constants.NO_IMAGE}
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



export default SingleModalImage;
