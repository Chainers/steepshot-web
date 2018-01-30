import React from 'react';
import Constants from "../../../common/constants";
import {connect} from "react-redux";
import {setActiveIndex} from "../../../actions/search";

const KEYS = [
  {label: Constants.SEARCH_FILTERS.CATEGORIES.label},
  {label: Constants.SEARCH_FILTERS.USERS.label},
];

class Tabs extends React.Component {

  constructor(props) {
    super(props);
  }

  renderNavigation() {
    let navItems = [];
    KEYS.map((item, index) => {
      let styles = 'nav-item';
      if (this.props.activeIndex == index) {
        styles = 'nav-item active';
      }

      navItems.push(
        <li role="presentation" key={index} className={styles}>
          <a onClick={() => this.props.setActiveIndex(index)}
             className="nav-link tab-head">
            {item.label}
          </a>
        </li>
      );
    });
    return navItems;
  }

  render() {
    return (
      <ul role="tablist" className="nav nav-tabs list-reset">
        {this.renderNavigation()}
      </ul>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.search
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveIndex: (index) => {
      dispatch(setActiveIndex(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
