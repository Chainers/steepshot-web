import React from 'react';
import { 
  connect
} from 'react-redux';
import {
  withRouter
} from 'react-router-dom';
import PropTypes from 'prop-types';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import ItemsComponent from '../UserProfile/itemsComponent';
import Constants from '../../common/constants';
import TabsWrapper from '../Wrappers/TabsWrapper';

class Browse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        { label : Constants.POSTS_FILTERS.POSTS_HOT.label },
        { label : Constants.POSTS_FILTERS.POSTS_NEW.label },
        { label : Constants.POSTS_FILTERS.POSTS_TOP.label }
      ],
      activeItemIndex : this.props.activeItemIndex
    };
  }

  componentDidMount() {
    if (this.state.activeItemIndex == -1) this.props.history.replace('/*');
    if (localStorage.getItem('browse') != undefined) this.props.history.replace('/browse/' + localStorage.getItem('browse'));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItemIndex == -1) this.props.history.replace('/*');
  }

  updateActiveTab(index) {
    this.setState({
      activeItemIndex : index
    }, () => {
      localStorage.setItem('browse', Constants.BROWSE_ROUTES[this.state.activeItemIndex].NAME);
      this.props.history.push(Constants.BROWSE_ROUTES[this.state.activeItemIndex].NAME);
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState == this.state) {
      return false;
    }
    return true;
  }

  render() {
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <TabsFilterComponent 
            keys={this.state.keys}
            activeItemIndex={this.state.activeItemIndex}
            updateCallback={this.updateActiveTab.bind(this)}
          />
          <TabsWrapper 
            activeTab={this.state.activeItemIndex}
          >
            <ItemsComponent 
              point={Constants.POSTS_FILTERS.POSTS_HOT.point} 
              cancelPrevious={false} 
              wrapperModifier="posts-list clearfix"
            />
            <ItemsComponent 
              point={Constants.POSTS_FILTERS.POSTS_NEW.point} 
              cancelPrevious={false} 
              wrapperModifier="posts-list clearfix"
            />
            <ItemsComponent 
              point={Constants.POSTS_FILTERS.POSTS_TOP.point} 
              cancelPrevious={false}
              wrapperModifier="posts-list clearfix"
            />
          </TabsWrapper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization
  };
};

export default withRouter(connect(mapStateToProps)(Browse));
