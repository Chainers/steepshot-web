import React from 'react';
import {connect} from "react-redux";
import {setActiveIndex} from "../../../actions/tabsBar";
import LoadingSpinner from "../../LoadingSpinner";
import Constants from "../../../common/constants";

class TabsBar extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    let navItems = [];
    this.props.children.map((item, index) => {
      if (!item.props.loading && !item.props.hide) {
        navItems.push(index);
      }
    });
    if (navItems.length === 1) {
      let itemIndex = navItems[0];
      if (this.props.activeIndex !== itemIndex) {
        this.props.setActiveIndex(itemIndex);
      }
    }
  }

  renderNavigation() {
    let navItems = [];
    this.props.children.map((item, index) => {
      let styles = 'nav-item';
      if (this.props.activeIndex === index) {
        styles = 'nav-item active';
      }
      if (!item.props.loading && !item.props.hide) {
        navItems.push(
          <li role="presentation" key={index} className={styles}>
            <a onClick={() => this.props.setActiveIndex(index)}
               className="nav-link tab-head">
              {item.props.name}
            </a>
          </li>
        );
      }
    });
    if (navItems.length === 1) {
      return null;
    }
    return (
      <ul role="tablist" className="nav nav-tabs list-reset">
        {navItems}
      </ul>);
  }

  renderChildren() {
    let allChildrenHide = true;
    let children = [];
    this.props.children.map((child, index) => {
      if (!child.props.hide || child.props.loading) {
        allChildrenHide = false;
      }
      children.push(
        React.cloneElement(child, {
          ...child.props,
          key: index,
          index
        }));
    });
    if (allChildrenHide) {
      return (
        <div className="empty-query-message">
          {Constants.EMPTY_QUERY}
        </div>);
    }
    return children;
  }

  renderLoader() {
    if (this.props.children[this.props.activeIndex].props.loading) {
      return (
        <LoadingSpinner style={{height: '100%', position: 'absolute'}}/>
      )
    }
    return null;
  }

  render() {
    return (
      <div id="workspace" className="g-content clearfix">
        {this.renderNavigation()}
        {this.renderChildren()}
        {this.renderLoader()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    activeIndex: state.tabsBar.activeIndex,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveIndex: (index) => {
      dispatch(setActiveIndex(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabsBar);
