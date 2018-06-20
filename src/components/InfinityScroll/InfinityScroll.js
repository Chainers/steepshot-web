import React from 'react';
import {connect} from 'react-redux';

class InfinityScroll extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.shouldFetch !== this.props.shouldFetch) {
			this.props.fetch();
		}
	}

	render() {
		return this.props.children
	}
}

const mapStateToProps = (state, props) => {
	return {
		shouldFetch: state.scroll[props.point].shouldFetch
	};
};

export default connect(mapStateToProps)(InfinityScroll);
