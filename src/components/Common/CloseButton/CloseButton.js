import React from "react";
import './closeButton.css';

const emptyFunc = () => {};

const CloseButton = ({onClick = emptyFunc, className = '', style = {}}) =>
  <div className={className}>
    <div className='container_clo-btn '
         style={style}
         onClick={() => onClick()}>
      <i className='button_clo-btn'/>
    </div>
  </div>
;

 export default CloseButton;
