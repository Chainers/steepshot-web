import React from 'react';
import {connect} from 'react-redux';
import ShowIf from '../ShowIf';
import LoadingSpinner from "../../LoadingSpinner";
import './bodyLoader.css';

class BodyLoader extends React.Component {

	render() {
		return (
			<ShowIf show={this.props.loading}>
				<div className="container_body-loader">
					<LoadingSpinner/>
				</div>
			</ShowIf>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.bodyLoader
	}
};

export default connect(mapStateToProps)(BodyLoader);
