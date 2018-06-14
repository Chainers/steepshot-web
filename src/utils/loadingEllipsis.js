import * as React from 'react';

export function loadingEllipsis(text, additionalClass) {
  return (
    <div className={`loading-ellipsis_main${' ' + additionalClass || ''}`}>
      {text}
      <span> .</span>
      <span> .</span>
      <span> .</span>
    </div>
  )
}