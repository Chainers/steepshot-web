import React from 'react';
import {
  connect
} from 'react-redux';
import {
  getUsersSearch,
  getPosts
} from '../../actions/posts';
import PropTypes from 'prop-types';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import ItemsComponent from '../UserProfile/itemsComponent';
import UsersComponent from '../UserProfile/UsersComponent';
import Constants from '../../common/constants';
import TabsWrapper from '../Wrappers/TabsWrapper';
import TabWrapper from '../Wrappers/TabWrapper';
import _ from 'lodash';

class SearchResultsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        { label : Constants.SEARCH_FILTERS.CATEGORIES.label },
        { label : Constants.SEARCH_FILTERS.USERS.label }
      ],
      activeItemIndex : 0,
      hotSectionOptions : {
        limit : 4
      },
      usersSearchOptions : {
        query : this.props.searchValue
      },
      searchValue : this.props.searchValue,
      showResults: false
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
      searchValue : nextProps.searchValue,
      needsForceRefresh : this.state.searchValue != nextProps.searchValue
    }, () => {
      this.setState({
        needsForceRefresh : false
      });
    })
  }

  updateActiveTab(index) {
    this.setState({
      activeItemIndex : index
    })
  }

  componentDidMount() {
    const options = {
      point : this.insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.state.searchValue),
      params :  Object.assign({}, {
        offset : null
      }, this.state.hotSectionOptions)
    };
    getPosts(options, false).then(result => {
      this.setState({
        ignored : _.map(result.results, 'url'),
        showResults : true
      })
    });
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
            <TabWrapper>
              <ItemsComponent
                point={this.insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.state.searchValue)}
                cancelPrevious={false}
                wrapperModifier="posts-list clearfix"
                options={this.state.hotSectionOptions}
                renderNotEmptyOnly={true}
                maxPosts={4}
                forceRefresh={this.state.needsForceRefresh}
                headerText={<span>{Constants.SEARCH_HEADING_LABELS.HOT_POSTS_RESULT}<u>{this.state.searchValue}</u></span>}
                key={1}
              />
              {
                this.state.showResults
                ?
                  <ItemsComponent
                    point={this.insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, this.state.searchValue)}
                    cancelPrevious={false}
                    ignored={this.state.ignored}
                    wrapperModifier="posts-list clearfix"
                    forceRefresh={this.state.needsForceRefresh}
                    headerText={<span>{Constants.SEARCH_HEADING_LABELS.NEW_POSTS_RESULT}<u>{this.state.searchValue}</u></span>}
                    key={2}
                  />
                :
                  null
              }
            </TabWrapper>
            <UsersComponent
              point={Constants.SEARCH_FILTERS.USERS.point}
              forceRefresh={this.state.needsForceRefresh}
              getUsers={getUsersSearch}
              options={this.state.usersSearchOptions}
              wrapperModifier="posts-list clearfix type-2"
              headerText={<span>{Constants.SEARCH_HEADING_LABELS.USERS_RESULT}<u>{this.state.searchValue}</u></span>}
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

export default connect(mapStateToProps)(SearchResultsComponent);
