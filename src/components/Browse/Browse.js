import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import TabsFilterComponent from '../Filters/TabsFilterComponent';
import Constants from '../../common/constants';
import TabsWrapper from '../Wrappers/TabsWrapper';
import {documentTitle} from '../DocumentTitle';
import PostsList from '../PostsList/PostsList';
import {withWrapper} from "create-react-server/wrapper";
import {addMetaTags} from "../../actions/metaTags";

class Browse extends React.Component {

	static async getInitialProps({location, req, res, store}) {
		console.log(location);
		console.log(req);
		console.log(res);
		console.log(arguments);
		console.log("_____________");
		store.dispatch(addMetaTags([{property: 'og:title', content: "steepshot.io"}]));
		store.dispatch(addMetaTags([{property: 'og:type', content: 'website'}]));
		store.dispatch(addMetaTags([{property: 'og:url', content: req.hostname + location.pathname}]));
		await store.dispatch(addMetaTags([{property: 'og:image', content: req.hostname + '/images/steepshotLogo@2x.svg'}]));
		return {};
	}


  constructor(props) {
    super();

    this.state = {
      keys : [
        { label : Constants.POSTS_FILTERS.POSTS_HOT.label },
        { label : Constants.POSTS_FILTERS.POSTS_NEW.label },
        { label : Constants.POSTS_FILTERS.POSTS_TOP.label }
      ],
      activeItemIndex : props.activeItemIndex
    };
  }

  componentDidMount() {
    localStorage.setItem('browse', Constants.BROWSE_ROUTES[this.state.activeItemIndex].NAME);
    documentTitle();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeItemIndex === -1) this.props.history.replace('/*');
  }

  updateActiveTab(index) {
    this.setState({
      activeItemIndex : index
    }, () => {
      localStorage.setItem('browse', Constants.BROWSE_ROUTES[this.state.activeItemIndex].NAME);
      this.props.history.push(Constants.BROWSE_ROUTES[this.state.activeItemIndex].NAME);
      documentTitle();
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state;
  }

  render() {
		if (global.isServerSide) {
			return null;
		}
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
            <PostsList
              point={Constants.POSTS_FILTERS.POSTS_HOT.point}
              cancelPrevious={false}
              wrapperModifier="posts-list offset-should-replace_browse clearfix"
            />
            <PostsList
              point={Constants.POSTS_FILTERS.POSTS_NEW.point}
              cancelPrevious={false}
              wrapperModifier="posts-list offset-should-replace_browse clearfix"
            />
            <PostsList
              point={Constants.POSTS_FILTERS.POSTS_TOP.point}
              cancelPrevious={false}
              wrapperModifier="posts-list offset-should-replace_browse clearfix"
            />
          </TabsWrapper>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default withWrapper(withRouter(connect(mapStateToProps)(Browse)));
