import React from 'react';
import { 
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import ItemsComponent from '../UserProfile/itemsComponent';
import Constants from '../../common/constants';

class Browse extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        { label : Constants.POSTS_FILTERS.POSTS_TOP.label },
        { label : Constants.POSTS_FILTERS.POSTS_HOT.label },
        { label : Constants.POSTS_FILTERS.POSTS_NEW.label }
      ],
      activeItemIndex : 0
    };
  }

  render() {
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <TabsFilterComponent 
            keys={this.state.keys}
            activeItemIndex={this.state.activeItemIndex}
          >
            <ItemsComponent 
              point={Constants.POSTS_FILTERS.POSTS_TOP.point} 
              cancelPrevious={false} 
              wrapperModifier="posts-list clearfix"
            />
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
          </TabsFilterComponent>
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

export default connect(mapStateToProps)(Browse);
