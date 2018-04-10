import React from 'react';
import {connect} from 'react-redux';
import 'react-image-gallery/styles/css/image-gallery.css';
import Constants from '../../common/constants';
import './imagesGallery.css';
import ShowIf from "../Common/ShowIf";
import LoadingSpinner from "../LoadingSpinner/index";

class SingleModalImage extends React.Component {

  render() {
    return (
      <div className="image-container_pos-mod"
           style={this.props.style.imgCont}
      >
        {/*{this.lowNSFWFilter()}*/}
        {/*<button className="btn btn-default btn-xs"*/}
                {/*onClick={() => this.props.copyToClipboard(*/}
                  {/*document.location.origin + '/post' + this.props.post.url.replace(/\/[\w-.]+/, ''),*/}
                {/*)}>Copy link*/}
        {/*</button>*/}
        {/*<ShowIf show={!this.props.style.isFullScreen && !this.props.fullScreenMode && !this.props.singlePost}>*/}
          {/*<div className="full-screen-button_pos-mod"*/}
               {/*onClick={this.setFullScreen.bind(this, true)}*/}
          {/*>*/}
            {/*<img className="img-full-screen" src="/images/shape.svg" alt="open full screen"/>*/}
          {/*</div>*/}
        {/*</ShowIf>*/}
        <img src={this.props.url || Constants.NO_IMAGE}
             alt={this.props.post.title}
             style={this.props.style.image}
             ref={ref => this.image = ref}
             // onLoad={this.imageLoaded.bind(this)}
             // onError={this.loadImgError.bind(this)}
             // onDoubleClick={this.setFullScreen.bind(this, !this.props.fullScreenMode)}
        />
        <ShowIf show={!this.image || !this.image.complete}>
          <div className="before-load-curtain_pos-mod">
            <LoadingSpinner/>
          </div>
        </ShowIf>
        <ShowIf show={this.image && this.image.complete && !this.image.naturalWidth}>
          <div className="before-load-curtain_pos-mod">
            <p className="title_pos-mod">Sorry, image isn't found.</p>
          </div>
        </ShowIf>
      </div>
    );
  }
}



export default SingleModalImage;
