import React from 'react';
import {connect} from "react-redux";
import ShowIf from "../../ShowIf";

class Tab extends React.Component {
  static defaultProps = {
    loading: false,
    empty: false
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ShowIf show={this.props.active && !this.props.empty} className="container_tab" removeFromDom={false}>
        {this.props.children}
      </ShowIf>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    active: state.tabsBar.activeIndex === props.index
  };
};


export default connect(mapStateToProps)(Tab);
