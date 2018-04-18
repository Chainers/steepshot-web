import React from 'react';
import {connect} from "react-redux";
import ShowIf from "../../ShowIf";

class Tab extends React.Component {
	static defaultProps = {
		loading: false,
		empty: false
	};

	render() {
		return (
			<ShowIf show={this.props.active && !this.props.empty} removeFromDom={false}>
				<div className={'tab_wrapper'}>
					{this.props.children}
				</div>
			</ShowIf>
		);
	}
}

const mapStateToProps = (state, props) => {
	return {
		active: state.tabsBar[props.point].activeIndex === props.index
	};
};


export default connect(mapStateToProps)(Tab);
