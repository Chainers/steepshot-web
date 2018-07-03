import React from 'react';
import {connect} from 'react-redux';
import {pageLoaded, setActiveIndex} from '../../../actions/tabsBar';
import LoadingSpinner from '../../LoadingSpinner';
import ShowIf from '../ShowIf';
import Constants from '../../../common/constants';
import './tabsBar.css';
import {setEmptyRequestError} from '../../../actions/emptyRequestError';

class TabsBar extends React.Component {
	static defaultProps = {
		className: '',
		alwaysShowNavigation: false,
		showLoader: true,
		changeIndex: () => {}
	};

	componentWillUnmount() {
		this.props.setEmptyRequestError('');
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.showLoader && this.props.emptyRequestError) {
      this.props.setEmptyRequestError('');
		}
	}

	componentDidUpdate() {
		let navItems = [];
		this.props.children.forEach((item, index) => {
			if (item.props.loading || !item.props.empty) {
				navItems.push(index);
			}
			if (!this.props.pageLoaded && !item.props.loading && this.props.activeIndex === index) {
				this.props.pageIsLoaded(this.props.point);
			}
		});
		if (navItems.length === 1) {
			let itemIndex = navItems[0];
			if (this.props.activeIndex !== itemIndex) {
				this.setIndex(itemIndex);
			}
		}
	}

	setIndex(index) {
		this.props.setActiveIndex(this.props.point, index);
		this.props.changeIndex(index);
	}

	renderNavigation() {
		let navItems = [];
		this.props.children.forEach((item, index) => {
			let styles = 'nav-item';
			if (this.props.activeIndex === index) {
				styles = 'nav-item active';
			}
			if ((!item.props.loading && !item.props.empty) || this.props.activeIndex === index) {
				navItems.push(
					<li role="presentation" key={index} className={styles}>
						<a onClick={() => this.setIndex(index)}
							 className="nav-link tab-head">
							{item.props.name}
						</a>
					</li>
				);
			}
		});
		if (!this.props.alwaysShowNavigation && navItems.length === 1) {
			return null;
		}
		return (
			<ul role="tablist" className="nav nav-tabs list-reset" style={this.props.style}>
				{navItems}
			</ul>);
	}

	renderChildren() {
		let allChildrenHide = true;
		let children = [];
		this.props.children.forEach((child, index) => {
			if (!child.props.empty || child.props.loading) {
				allChildrenHide = false;
			}
			children.push(
				React.cloneElement(child, {
					...child.props,
					key: index,
					point: this.props.point,
					index
				}));
		});
		if (allChildrenHide) {
			if (this.props.point === 'search') {
				this.props.setEmptyRequestError(this.props.point);
        return (
					<div className="empty-search_tabs-bar">
						We don't have anything for query
						<span> {this.props.searchQuery} </span>
						yet. Try to look for something else...
					</div>);
			}
			return (
				<div className="empty-query-message">
					{Constants.EMPTY_QUERY}
				</div>);
		}
		return children;
	}

	render() {
		return (
			<div className={"clearfix" + this.props.className}>
				{this.renderNavigation()}
				{this.renderChildren()}
				<ShowIf show={!this.props.pageLoaded && this.props.showLoader}>
					<LoadingSpinner style={{height: '80vh'}}/>
				</ShowIf>
			</div>
		);
	}
}

const mapStateToProps = (state, props) => {
	const searchQuery  = state.router.location.pathname.replace(/\/search\/([\w-.]+)/, '$1');
	return {
		...state.tabsBar[props.point],
		emptyRequestError: state.emptyRequestError.point,
		searchQuery
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setActiveIndex: (point, index) => {
			dispatch(setActiveIndex(point, index));
		},
		pageIsLoaded: (point) => {
			dispatch(pageLoaded(point));
		},
    setEmptyRequestError: (point) => {
			dispatch(setEmptyRequestError(point));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsBar);
