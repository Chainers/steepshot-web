import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import PostsList from '../PostsList/PostsList';
import {getUsersSearch} from '../../actions/posts';
import {documentTitle} from '../DocumentTitle';
import {insertCategory, setActiveIndex,} from '../../actions/search';
import {debounce} from 'lodash';
import UsersList from '../UsersList/UsersList';
import Tabs from "./Tabs/Tabs";
import {setUsersSearchValue} from "../../actions/usersList";
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
    return (
      <div className="g-main_i container">
        <div id="workspace" className="g-content clearfix">
          <Tabs/>
          <ShowIf show={this.props.activeIndex === 0} removeFromDom={false}>
            <PostsList
              point={insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.props.searchValue)}
              wrapperModifier="posts-list clearfix"
              cancelPrevious={false}
              options={this.props.hotSectionOptions}
              maxPosts={4}
              headerText={hotPost}
              isComponentVisible={this.props.activeIndex === 0}
            />

            <PostsList
              point={insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, this.props.searchValue)}
              wrapperModifier="posts-list clearfix"
              cancelPrevious={false}
              ignored={insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, this.props.searchValue)}
              headerText={newPost}
              isComponentVisible={this.props.activeIndex === 0}
            />

          </ShowIf>
          <ShowIf show={this.props.activeIndex === 1} removeFromDom={false}>
            <ShowIf show={this.props.usersList && this.props.usersList.users.length} removeFromDom={false}>
              <UsersList
                point={Constants.SEARCH_FILTERS.USERS.point}
                getUsers={getUsersSearch}
                options={{
                  query: this.props.searchValue,
                }}
                wrapperModifier="posts-list clearfix type-2"
                headerText={userResult}
                isComponentVisible={this.props.activeIndex === 1}
              />
            </ShowIf>
          </ShowIf>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let searchValue = props.match.params.searchValue;
  return {
    hotPostsList: state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_HOT.point, searchValue)],
    newPostsList: state.postsList[insertCategory(Constants.POSTS_FILTERS.POSTS_NEW.point, searchValue)],
    usersList: state.usersList[Constants.SEARCH_FILTERS.USERS.point],
    ...state.search,
    searchValue,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveIndex: (index) => {
      dispatch(setActiveIndex(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
