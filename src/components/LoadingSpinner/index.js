import React from 'react';
import './loadingSpinner.css';

class LoadingSpinner extends React.Component {

	render() {
		return (
			<div className="loader-blocker"
					 style={this.props.style}>
				<div className={this.props.loaderClass ? this.props.loaderClass : 'loader'}/>
			</div>
		)
	}
}

export default LoadingSpinner;
