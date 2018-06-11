import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';
import {getBodyParams} from '../../actions/bodyParams';

class Modals extends React.Component {

	render() {
		let modals = [];
		for (let key in this.props.modals) {
			modals.push(<Modal key={key} index={key}/>);
		}
		return (
			<div className="modals-component_mod">
				{modals}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		modals: state.modals,
		bodyParams: state.bodyParams
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getBodyParams: (offsetTop) => {
			dispatch(getBodyParams(offsetTop));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Modals);
