import React from 'react';
import ReactPlayer from 'react-player'
import ShowIf from '../../Common/ShowIf';
import LowNSFWFilter from './LowNSFWFilter';
import LoadingFilter from './LoadingFilter';
import CopyLink from '../CopyLink/CopyLink';
import ImagesGallery from '../../ImagesGallery/ImagesGallery';

const RenderImage = ({previousStyle, style, showAll, fullScreenMode, post, notFullScreenByScreenSize,
                       index, singlePost, urlVideo, setPostModalSize, copyLinkToClipboard, setFullScreen}) => {

  let previousImageWidth;
  if (previousStyle && previousStyle.image) {
    previousImageWidth = {width: previousStyle.image.width};
  }

  return (
    <div className="image-container_pos-mod"
         style={style.imgCont || previousImageWidth}
         onDoubleClick={(e) => setFullScreen(!fullScreenMode, e)}>
      <LowNSFWFilter post={post}
                     showAll={showAll}
                     fullScreenMode={fullScreenMode}/>
      <LoadingFilter isFullScreen={false} />
      <CopyLink onClick={copyLinkToClipboard} />
      <ShowIf show={!notFullScreenByScreenSize && !fullScreenMode && !singlePost}>
        <div className="full-screen-button_pos-mod"
             onClick={() => setFullScreen(true, false)}
        >
          <img className="img-full-screen" src="/images/shape.svg" alt="open full screen"/>
        </div>
      </ShowIf>
      <ShowIf show={!post.isVideo}>
        <ImagesGallery index={index}
                       styles={style.image}
                       isFullScreen={false}
                       setPostModalSize={setPostModalSize}/>
      </ShowIf>
      <ShowIf show={post.isVideo}>
        <div className="image-container_pos-mod image-container_vid-con"
             style={style.imgCont || previousImageWidth}
        >
          <ReactPlayer
            width='100%'
            height='100%'
            url={urlVideo}
            playing={true}
            loop={true}/>
        </div>
      </ShowIf>
    </div>
  )
};

export default RenderImage;