import React from 'react';
import {connect} from 'react-redux';
import {setInfinityScrollForFetch} from "../../actions/infinityScroll";

class InfinityScroll extends React.Component {

	componentWillReceiveProps(nextProps) {
		if (nextProps.scrollPosition >= 70 && this.props.hasMore
			&& nextProps.currentScrollHeight !== nextProps.scrollHeightForLastFetch) {
			console.log(nextProps.currentScrollHeight, nextProps.scrollHeightForLastFetch);
			this.props.setInfinityScrollForFetch(nextProps.currentScrollHeight);
			this.props.fetch();
		}
	}

	render() {
		return this.props.children
	}
}

const mapStateToProps = (state) => {
	return {
		scrollPosition: state.body.position,
		currentScrollHeight: state.body.scrollHeight,
		scrollHeightForLastFetch: state.infinityScroll.scrollHeight
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setInfinityScrollForFetch: height => {
			dispatch(setInfinityScrollForFetch(height));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(InfinityScroll);
