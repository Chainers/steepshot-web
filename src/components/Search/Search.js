import React from 'react';
import Constants from '../../common/constants';
import PostsList from '../PostsList/PostsList';
import {getUsersSearch} from '../../actions/posts';
import {documentTitle} from '../DocumentTitle';
import {insertCategory} from '../../utils/search';
import {debounce} from 'lodash';
import UsersList from '../UsersList/UsersList';
import TabsBar from "../Common/TabsBar/TabsBar";
import {connect} from "react-redux";
import Tab from "../Common/TabsBar/Tab/Tab";
import ShowIf from "../Common/ShowIf";

class Search extends React.Component {
  constructor(props) {
    super(props);
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
    return <div className="g-main_i container">
      <TabsBar>
        <Tab name="Tag"
             loading={this.props.hotPostsList.loading || this.props.newPostsList.loading}
             empty={!this.props.newPostsList.posts.length}>
          <PostsList
            point={insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.props.searchValue)}
            wrapperModifier="posts-list clearfix"
            cancelPrevious={false}
            options={{limit: 4}}
            maxPosts={4}
            headerText={hotPost}
            isComponentVisible={this.props.activeIndex === 0}
          />
          <ShowIf show={this.props.newPostsList.posts.length >= 4} removeFromDom={false}>
            <PostsList
              point={insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, this.props.searchValue)}
              wrapperModifier="posts-list clearfix"
              cancelPrevious={false}
              ignored={insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.props.searchValue)}
              headerText={newPost}
              isComponentVisible={this.props.activeIndex === 0}
            />
          </ShowIf>
        </Tab>
        <Tab name="Users"
             loading={this.props.usersList.loading}
             empty={!this.props.usersList.users.length}>
          <UsersList
            point={Constants.SEARCH_FILTERS.USERS.point}
            getUsers={getUsersSearch}
            options={{query: this.props.searchValue}}
            wrapperModifier="posts-list clearfix type-2"
            headerText={userResult}
            isComponentVisible={this.props.activeIndex === 1}
          />
        </Tab>
      </TabsBar>
    </div>;
  }
}

const mapStateToProps = (state, props) => {
  let searchValue = props.match.params.searchValue;
  let hotPostsList = state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, searchValue)];
  hotPostsList = hotPostsList ? hotPostsList : {loading: true, posts: []};
  let newPostsList = state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, searchValue)];
  newPostsList = newPostsList ? newPostsList : {loading: true, posts: []};
  let usersList = state.usersList[Constants.SEARCH_FILTERS.USERS.point];
  usersList = usersList ? usersList : {loading: true, users: []};

  return {
    hotPostsList,
    newPostsList,
    usersList,
    ...state.search,
    searchValue,
  };
};

export default connect(mapStateToProps)(Search);
