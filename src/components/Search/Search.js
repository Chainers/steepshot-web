import React from 'react';
import {connect} from 'react-redux';
import Constants from '../../common/constants';
import PostsList from '../PostsList/PostsList';
import {getUsersSearch} from '../../actions/posts';
import {documentTitle} from '../DocumentTitle';
import {getIgnoredPostsList, insertCategory, setActiveIndex,} from '../../actions/search';
import {debounce} from 'lodash';
import UsersList from '../UsersList/UsersList';
import Tabs from "./Tabs/Tabs";
import ShowIf from "../Common/ShowIf";

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
          <Tabs/>
          <div style={this.props.activeIndex === 0 ? {} : {display: 'none'}}>
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
              ignored={this.props.ignored}
              headerText={newPost}
              isComponentVisible={this.props.activeIndex === 0}
            />

          </div>
          <div style={this.props.activeIndex === 1 ? {} : {display: 'none'}}>
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
          </div>
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
