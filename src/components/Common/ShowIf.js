import React from 'react';
import PropTypes from 'prop-types';

class ShowIf extends React.Component {

	render() {
		if (this.props.removeFromDom && !this.props.show) {
			return null;
		}
		
		let children = this.props.children.length > 1
			? <div className="container_show-if">{this.props.children}</div>
			: this.props.children;

		let style = this.props.show ? {} : {display: 'none'};
		if (children.props.style) {
			style = {
				...style,
				...children.props.style
			}
		}
		return React.cloneElement(children, {
			style,
			className: (children.props.className || '') + ' ' + (this.props.className || '')
		});
	}
}

ShowIf.defaultProps = {
	removeFromDom: true,
	show: false
};

ShowIf.propTypes = {
	show: PropTypes.any,
	children: PropTypes.node.isRequired,
	removeFromDom: PropTypes.bool
};

export default ShowIf;
