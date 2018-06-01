import React from 'react';
import {connect} from 'react-redux';
import {scrollDataUpdated} from "../../actions/scroll";

class InfinityScroll extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.scrollPosition >= 70 && this.props.hasMore
			&& nextProps.currentScrollHeight !== nextProps.dataUpdated) {
			this.props.scrollDataUpdated(nextProps.point, nextProps.currentScrollHeight);
			this.props.fetch();
		}
	}

	render() {
		return this.props.children
	}
}

const mapStateToProps = (state, props) => {
	return {
		scrollPosition: state.scroll[props.point].position,
		currentScrollHeight: state.scroll[props.point].scrollHeight,
		dataUpdated: state.scroll[props.point].dataUpdated
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		scrollDataUpdated: (point, height) => {
			dispatch(scrollDataUpdated(point, height));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InfinityScroll);
