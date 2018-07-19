import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../../common/constants';

class PostImgBackground extends React.Component {

	static defaultProps = {
		style: {}
	};

	render() {
		const imageBackground = {
			backgroundImage: 'url(' + this.props.imageUrl + ')',
		};
		return (
			<div style={imageBackground} className="img_post"></div>
		)
	}
}

const mapStateToProps = (state, props) => {
	let imageUrl, image;
	if (props.src === Constants.NO_IMAGE) {
		imageUrl = props.src;
	} else {
		image = state.images[props.src]
	}
	if (image) {
		imageUrl = image[props.sizes];
	}
	return {
		imageUrl
	}
};

export default connect(mapStateToProps)(PostImgBackground);
