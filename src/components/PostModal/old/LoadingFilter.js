import React from 'react';
import LoadingSpinner from '../../LoadingSpinner/index';

const LoadingFilter = ({isFullScreen}) => {
  let holderClass = isFullScreen ? 'before-load-full-screen_pos-mod' : 'before-load-curtain_pos-mod';
  return (
    <div className={holderClass} style={{width: '100%'}}>
      <LoadingSpinner/>
    </div>
  )
};

export default LoadingFilter;