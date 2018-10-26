import React from 'react';
import { connect } from 'react-redux';

import PostsList from '../PostsList/PostsList';
import UsersList from '../UsersList/UsersList';
import TabsBar from '../Common/TabsBar/TabsBar';
import Tab from '../Common/TabsBar/Tab/Tab';
import ShowIf from '../Common/ShowIf';

import { documentTitle } from '../../utils/documentTitle';
import { insertCategory } from '../../utils/search';
import { pageLoading } from '../../actions/tabsBar';
import Constants from '../../common/constants';

class Search extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.searchValue !== nextProps.searchValue) {
      this.props.pageLoading('search');
    }
    return true;
  }

  componentWillUpdate() {
    documentTitle();
  }

  documentWillMount() {
    documentTitle();
  }

  render() {
    let hotPost = (
      <span>
        {Constants.SEARCH_HEADING_LABELS.HOT_POSTS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>
    );
    let newPost = (
      <span>
        {Constants.SEARCH_HEADING_LABELS.NEW_POSTS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>
    );
    let userResult = (
      <span>
        {Constants.SEARCH_HEADING_LABELS.USERS_RESULT}
        <u>{this.props.searchValue}</u>
      </span>
    );
    return (
      <div className="container">
        <TabsBar point="search" className="g-content" style={{ marginTop: 30 }}>
          <Tab
            name="Tag"
            loading={this.props.hotPostsList.loading || this.props.newPostsList.loading}
            empty={!this.props.newPostsList.posts.length}
          >
            <ShowIf show={this.props.hotPostsList.posts.length > 0} removeFromDom={false}>
              <PostsList
                point={insertCategory(
                  Constants.POSTS_FILTERS.POSTS_HOT.point,
                  this.props.searchValue,
                )}
                wrapperModifier="posts-list clearfix"
                options={{ limit: 4 }}
                maxPosts={4}
                headerText={hotPost}
                isComponentVisible={this.props.activeIndex === 0}
              />
            </ShowIf>
            <ShowIf show={this.props.newPostsList.posts.length >= 4} removeFromDom={false}>
              <PostsList
                point={insertCategory(
                  Constants.POSTS_FILTERS.POSTS_NEW.point,
                  this.props.searchValue,
                )}
                wrapperModifier="posts-list clearfix"
                ignored={insertCategory(
                  Constants.POSTS_FILTERS.POSTS_HOT.point,
                  this.props.searchValue,
                )}
                headerText={newPost}
                isComponentVisible={this.props.activeIndex === 0}
              />
            </ShowIf>
          </Tab>
          <Tab
            name="Users"
            loading={this.props.usersList.loading}
            empty={!this.props.usersList.users.length}
          >
            <div className="heading-lead">
              <p>{userResult}</p>
              <hr />
            </div>
            <UsersList
              point={Constants.SEARCH_FILTERS.USERS.point}
              options={{ query: this.props.searchValue }}
              isComponentVisible={this.props.activeIndex === 1}
            />
          </Tab>
        </TabsBar>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let searchValue = props.match.params.searchValue;
  let hotPostsList =
    state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, searchValue)];
  hotPostsList = hotPostsList ? hotPostsList : { loading: true, posts: [] };
  let newPostsList =
    state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, searchValue)];
  newPostsList = newPostsList ? newPostsList : { loading: true, posts: [] };
  let usersList =
    state.usersList[
      `${Constants.SEARCH_FILTERS.USERS.point}JSON_OPTIONS:${JSON.stringify({
        query: props.match.params.searchValue,
      })}`
    ];
  usersList = usersList ? usersList : { loading: true, users: [] };
  return {
    hotPostsList,
    newPostsList,
    usersList,
    ...state.tabsBar.search,
    searchValue,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    pageLoading: point => {
      dispatch(pageLoading(point));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Search);
