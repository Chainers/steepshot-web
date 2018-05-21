import React from 'react';
import ShowIf from '../ShowIf';
import LoadingSpinner from "../../LoadingSpinner";
import PropTypes from "prop-types";
import './blockLoader.css';

const BodyLoader = ({show, withLoader}) => (
	<ShowIf show={show}>
		<div className="container_block-loader">
			<ShowIf show={withLoader}>
				<LoadingSpinner/>
			</ShowIf>
		</div>
	</ShowIf>
);

BodyLoader.propTypes = {
	show: PropTypes.bool.isRequired,
	withLoader: PropTypes.bool
};

BodyLoader.defaultProps = {
	withLoader: true
};

export default BodyLoader;
