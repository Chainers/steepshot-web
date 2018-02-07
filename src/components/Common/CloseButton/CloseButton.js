import React from "react";

const CloseButton = ({onClick = () => {}, className = '', style = {}}) =>
  <div className={className + ' container_clo-btn'}
       style={style}
       onClick={() => onClick()}>
    <i className='button_clo-btn'/>
  </div>
;

 export default CloseButton;
