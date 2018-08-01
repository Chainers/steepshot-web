import React from 'react';
import {connect} from 'react-redux';

class AvaImgBackground extends React.Component {

	static defaultProps = {
		style: {}
	};

	pic() {
		return Object.assign({}, this.props.style, {
			backgroundImage: 'url("' + this.props.imageUrl + '")'
		});
	}

	render() {
		return (
			<div className="pic_ava-com" style={this.pic()}/>
		)
	}
}

const mapStateToProps = (state, props) => {
	let imageUrl = props.src;
	let image = state.images[props.src];
	if (image) {
		imageUrl = image[props.sizes];
	}
	return {
		imageUrl
	}
};

export default connect(mapStateToProps)(AvaImgBackground);
