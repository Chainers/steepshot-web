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

import ShowIf from '../Common/ShowIf';

class SearchResultsComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      keys : [
        { label : Constants.SEARCH_FILTERS.CATEGORIES.label },
        { label : Constants.SEARCH_FILTERS.USERS.label }
      ],
      activeItemIndex : 0,
      hideParam : false,
      fullHideParam : true,
      numberPosts : 0,
      numberUsers : 0,
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

  controlTabs(number) {
      if (number == 0) {
          this.setState({activeItemIndex : 1, numberPosts : number});
      } else {
          this.setState({activeItemIndex : 0, numberPosts : number});
      }
      if (this.state.numberUsers[0] == undefined && number > 0) {
          this.setState({fullHideParam : true});
      }
  }

  hideTabs(number) {
      this.setState({numberUsers : number}, () => {
        if (number[0] != undefined && this.state.numberPosts > 0) {
          this.setState({hideParam : true});
        } else {
          this.setState({hideParam : false});
        }
        if (number[0] == undefined && this.state.numberPosts == 0) {
          this.setState({fullHideParam : false});
        } else {
          this.setState({fullHideParam : true});
        }
      });
  }

  render() {

    let hotPost = <ShowIf show={this.state.fullHideParam}>
                     <span>{Constants.SEARCH_HEADING_LABELS.HOT_POSTS_RESULT}<u>{this.state.searchValue}</u></span>
                  </ShowIf>;
    let newPost = <span>{Constants.SEARCH_HEADING_LABELS.NEW_POSTS_RESULT}<u>{this.state.searchValue}</u></span>
    let userResult = <ShowIf show={this.state.fullHideParam}>
                        <span>{Constants.SEARCH_HEADING_LABELS.USERS_RESULT}<u>{this.state.searchValue}</u></span>
                     </ShowIf>;

    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <ShowIf show={this.state.hideParam}>
            <TabsFilterComponent
              keys={this.state.keys}
              activeItemIndex={this.state.activeItemIndex}
              updateCallback={this.updateActiveTab.bind(this)}
            />
          </ShowIf>
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
                headerText= {hotPost}
                controlTabs={this.controlTabs.bind(this)}
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
                    headerText={newPost}
                    controlTabs={this.controlTabs.bind(this)}
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
                headerText={userResult}
                hideTabs={this.hideTabs.bind(this)}
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
