import React from 'react';
import { 
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import ItemsComponent from '../UserProfile/itemsComponent';
import Constants from '../../common/constants';

class SearchResultsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        Constants.POSTS_FILTERS.POSTS_TOP,
        Constants.POSTS_FILTERS.POSTS_HOT,
        Constants.POSTS_FILTERS.POSTS_NEW
      ],
      activeItemIndex : 0,
      searchValue : this.props.searchValue
    };
    this.state.filterParams = {
      point : this.state.keys[this.state.activeItemIndex].point
    }
  }

  updatePostsByFilter(filterParams) {
    this.setState({ 
      filterParams : filterParams
    });
  }

  render() {
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <TabsFilterComponent 
            updateCallback={this.updatePostsByFilter.bind(this)}
            keys={this.state.keys}
            activeItemIndex={this.state.activeItemIndex}
          />
          <ItemsComponent point={this.state.filterParams.point} wrapperModifier="posts-list clearfix"/>
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

export default connect(mapStateToProps)(SearchResultsComponent);