import React from 'react';
import Constants from '../../../common/constants';

const Avatar = ({src, style = {}}) => {
  const stylesPic = Object.assign({}, style, {
    backgroundImage : 'url(' + src + ')'
  });
  const stylesError = Object.assign({}, style, {
    backgroundImage : 'url(' + Constants.NO_AVATAR + ')'
  });
  return (
    <div className="pic_ava-com" style={stylesError}>
      <div className="pic_ava-com" style={stylesPic}/>
    </div>
  )
};

export default Avatar;
