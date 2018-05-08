import React from 'react';
import PropTypes from 'prop-types';
import './hamburger.css';

class Hamburger extends React.Component {

	render() {
		const {toggle, pressed} = this.props;
		return (
			<div className={'container_hamburger' + (pressed ? ' pressed_hamburger' : '')} onClick={toggle}>
				<span className="icon_hamburger"/>
			</div>
		)
	}
}

Hamburger.propTypes = {
	toggle: PropTypes.func.isRequired,
	pressed: PropTypes.bool.isRequired
};

export default Hamburger;
