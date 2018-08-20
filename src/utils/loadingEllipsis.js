import React from 'react';

export function loadingEllipsis(text, additionalClass) {
	return (
		<div className={`loading-ellipsis_main${' ' + additionalClass || ''}`}>
			{text}
			<span>&nbsp;.</span>
			<span>&nbsp;.</span>
			<span>&nbsp;.</span>
		</div>
	)
}