import React from 'react';
import { 
  connect
} from 'react-redux';
import {
  getUsersSearch,
  getPostsBySearch
} from '../../actions/posts';
import PropTypes from 'prop-types';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import ItemsComponent from '../UserProfile/itemsComponent';
import UsersComponent from '../UserProfile/UsersComponent';
import Constants from '../../common/constants';
import HeadingLeadComponent from '../Atoms/HeadingLeadComponent';

class SearchResultsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        { label : Constants.SEARCH.USERS.label },
        { label : Constants.SEARCH.CATEGORIES.label }
      ],
      activeItemIndex : 0,
      hotSectionOptions : {
        limit : 4
      },
      usersSearchOptions : {
        query : this.props.searchValue
      },
      searchValue : this.props.searchValue
    };
  }

  insertCategory(point, category) {
    if (category == undefined) return point;
    let path = point.split('/');
    return `${path[0]}/${category}/${path[1]}`;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      categorySectionOptions : {
        query : nextProps.searchValue
      },
      usersSearchOptions : {
        query : nextProps.searchValue
      },
      searchValue : nextProps.searchValue
    })
  }

  render() {
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <TabsFilterComponent 
            keys={this.state.keys}
            activeItemIndex={this.state.activeItemIndex}
          >
            <UsersComponent
              point={Constants.SEARCH.USERS.point}
              getUsers={getUsersSearch}
              options={this.state.usersSearchOptions}
              wrapperModifier="posts-list clearfix type-2"
            />
            <div>
              <ItemsComponent
                point={this.insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.state.searchValue)}
                cancelPrevious={false}
                wrapperModifier="posts-list clearfix"
                options={this.state.hotSectionOptions}
                showHasMore={false}
                renderNotEmptyOnly={true}
                header={<HeadingLeadComponent text={'Hottest posts by category ' + this.state.searchValue}/>}
              />
              <ItemsComponent 
                point={this.insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, this.state.searchValue)} 
                cancelPrevious={false} 
                wrapperModifier="posts-list clearfix"
                header={<HeadingLeadComponent text={'New posts by category ' + this.state.searchValue}/>}
              />
            </div>
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

export default connect(mapStateToProps)(SearchResultsComponent);
