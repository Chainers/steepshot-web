import React from 'react';
import Browse from '../Browse/Browse';
import Constants from '../../common/constants';

const BrowseWrapper = (props) => {
	console.log(props);
	let activeItemIndex = -1;
	let urlObject = props.location.pathname.split('/');
	console.log(props.location.pathname);
	console.log(urlObject);
	console.log("______________");
	if (urlObject.length < 4) {
		Constants.BROWSE_ROUTES.forEach(item => {
			console.log(item);

			if (item.NAME === urlObject[2]) activeItemIndex = item.INDEX;
		});
	}
	console.log("______________");
	return (
		<Browse {...Object.assign({}, props, {activeItemIndex: activeItemIndex})} />
	)
};

export default BrowseWrapper;
