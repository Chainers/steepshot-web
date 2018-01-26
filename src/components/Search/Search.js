import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import TabsWrapper from '../Wrappers/TabsWrapper';
import PostsList from '../PostsList/PostsList';
import ShowIf from '../Common/ShowIf';
import UsersComponent from '../UserProfile/UsersComponent';
import {getUsersSearch} from '../../actions/posts';
import {documentTitle} from '../DocumentTitle';
import {
  getIgnoredPostsList, insertCategory,
  setActiveIndex,
} from '../../actions/search';
import TabWrapper from '../Wrappers/TabWrapper';
import {debounce} from 'lodash';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.props.getIgnoredPostsList(this.props.searchValue);
  }
  
  componentWillReceiveProps(nextProps) {
    if (nextProps.searchValue !== this.props.searchValue) {
      this.props.getIgnoredPostsList(this.props.searchValue);
    }
  }
  
  componentWillUpdate() {
    documentTitle();
  }
  
  render() {
    let hotPost =
      <span>{Constants.SEARCH_HEADING_LABELS.HOT_POSTS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>;
    let newPost =
      <span>{Constants.SEARCH_HEADING_LABELS.NEW_POSTS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>;
    let userResult =
      <span>{Constants.SEARCH_HEADING_LABELS.USERS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>;
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <TabsFilterComponent
            keys={this.props.keys}
            activeItemIndex={this.props.activeIndex}
            updateCallback={this.props.setActiveIndex}
          />
          <TabsWrapper
            activeTab={this.props.activeIndex}
          >
            <TabWrapper>
                <PostsList
                  point={insertCategory(
                    Constants.POSTS_FILTERS.POSTS_HOT.point,
                    this.props.searchValue)}
                  wrapperModifier="posts-list clearfix"
                  cancelPrevious={false}
                  options={this.props.hotSectionOptions}
                  maxPosts={4}
                  headerText={hotPost}
                />
                <ShowIf show={this.props.showResults}>
                  <PostsList
                    point={insertCategory(
                      Constants.POSTS_FILTERS.POSTS_NEW.point,
                      this.props.searchValue)}
                    wrapperModifier="posts-list clearfix"
                    cancelPrevious={false}
                    ignored={this.props.ignored}
                    headerText={newPost}
                  />
                </ShowIf>
            </TabWrapper>
            <UsersComponent
              point={Constants.SEARCH_FILTERS.USERS.point}
              forceRefresh={this.props.needsForceRefresh}
              getUsers={getUsersSearch}
              options={{
                query: this.props.searchValue,
              }}
              wrapperModifier="posts-list clearfix type-2"
              headerText={userResult}
            />
          </TabsWrapper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.search,
    ...state.postsList[insertCategory(
      Constants.POSTS_FILTERS.POSTS_NEW.point,
      props.match.params.searchValue)],
    searchValue: props.match.params.searchValue,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getIgnoredPostsList: (searchValue) => {
      dispatch(getIgnoredPostsList(searchValue));
    },
    setActiveIndex: (options) => {
      dispatch(setActiveIndex(options));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
