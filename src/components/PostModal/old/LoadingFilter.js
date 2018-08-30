import React from 'react';
import LoadingSpinner from '../../LoadingSpinner/index';

const LoadingFilter = ({isFullScreen, newImageLoading}) => {
  let holderClass = isFullScreen ? 'before-load-full-screen_pos-mod' : 'before-load-curtain_pos-mod';
  if (!newImageLoading) return null;
  return (
    <div className={holderClass} style={{width: '100%'}}>
      <LoadingSpinner/>
    </div>
  )
};

export default LoadingFilter;