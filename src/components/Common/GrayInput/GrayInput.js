import React from 'react';
import './grayInput.css';
import ShowIf from '../ShowIf';

class GrayInput extends React.Component {

	get value() {
		return this.field.value;
	}

	select() {
		this.field.select();
	}

	render() {
		const {className, label, error} = this.props;
		return (
			<div className={'container_gray-input ' + (className || '')}>
				<div className="wrapper-inscription_gray-input">
					<ShowIf show={label}>
						<p>{label}</p>
					</ShowIf>
				</div>
        {React.cloneElement(<input ref={ref => this.field = ref}/>,	{...this.props, className: ''})}
				<label>{error}</label>
			</div>
		)
	}
}

export default GrayInput;