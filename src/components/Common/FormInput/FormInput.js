import React from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import ShowIf from "../ShowIf";
import {blurFormInput, changeFormInput, createFormInput, focusFormInput} from "../../../actions/formInputActions";
import './formInput.css';

class FormInput extends React.Component {

	constructor(props) {
		super();
		props.init(props.point);
	}

	componentDidMount() {
		if (this.props.isName) this.input.focus();
  }

	inputOnChange() {
		let nameInput = this.input.value;
		if (this.props.isName) {
			nameInput = nameInput.replace(/[^\w-.]+/g, '');
			nameInput = nameInput.toLowerCase();
		}
		this.props.changeText(this.props.point, nameInput);
	}

	render() {
		return (
			<div className={'container_for-inp'
			+ (this.props.focused ? ' focused_for-inp' : '')
			+ (this.props.errorMsg ? ' error_for-inp' : '')}>
				<label>{this.props.label}</label>
				<input onFocus={() => this.props.focus(this.props.point)}
							 onBlur={() => {
								 if (this.input && !this.input.value) {
									 this.props.blur(this.props.point);
								 }
							 }}
							 autoComplete="new-password"
							 type={this.props.type}
							 name={this.props.type}
							 onChange={this.inputOnChange.bind(this)}
							 ref={ref => this.input = ref}
				/>
				<ShowIf show={this.props.errorMsg}>
					<div className="error-msg_for-inp">{this.props.errorMsg}</div>
				</ShowIf>
			</div>
		)
	}
}

FormInput.propTypes = {
	point: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	type: PropTypes.string
};

FormInput.defaultProps = {
	type: 'text',
};

const mapStateToProps = (state, props) => {
	return {
		isName: props.label === 'Name',
		...state.formInput[props.point]
	}
};

const mapDispatchToProps = dispatch => {
	return {
		init: point => {
			dispatch(createFormInput(point))
		},
		focus: point => {
			dispatch(focusFormInput(point))
		},
		blur: point => {
			dispatch(blurFormInput(point))
		},
		changeText: (point, value) => {
			dispatch(changeFormInput(point, value))
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(FormInput);

