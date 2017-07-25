import React from 'react';
import { getUserFeed } from '../../actions/posts';
import PostItem from '../Posts/Item';
import { connect, store } from 'react-redux';
import InfiniteScroll from '../Scroller/infinityScroll';
import PropTypes from 'prop-types';
import { getStore } from '../../store/configureStore';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            hasMore: true,
            offset: null
        };

        this.store = getStore();
    }

    componentDidMount() {
        this.loadUserPosts();
    }

    loadUserPosts() {
        this.setState({
            posts: [], offset: null
        });
        this.setUserPosts();
    }

    setUserPosts() {
        let _this = this;

        getUserFeed(this.props.user).then((response) => {
            _this.setState({
                posts: response.results, 
                offset: response.offset
            });
        });
    }

    fetchPostsNext() {
        let _this = this;

        getUserFeed(this.props.user, this.state.offset).then((response) => {
            this.state.posts.pop();
            let newPosts = this.state.posts.concat(response.results);
            if (response.count < 20) {
                _this.setState({
                    posts: newPosts, 
                    offset: response.offset, 
                    hasMore: false});
            } else {
                _this.setState({
                    posts: newPosts, 
                    offset: response.offset
                });
            }
        });
    }

    render() {
        let items = [];
        let _this = this;
        let renderElements = <div className='loading-block'><br /><h4>No find results for '{this.props.search.value}' filter</h4></div>;

        if (this.state.posts.length > 0) {
            this.state.posts.map((post, index) => {
                items.push(<PostItem key={index} item={post} items={_this.state.posts} index={index} loadMore={this.fetchPostsNext.bind(this)}/>);
            });

            renderElements = <InfiniteScroll
                next={this.fetchPostsNext.bind(this)}
                hasMore={this.state.hasMore}
                loader={<div className='loading-block'><br /><h4>Loading...</h4></div>}
                endMessage={
                    <p className='loading-block'>
                        <b>Yay! You have seen it all</b>
                    </p>
                }>
                {items}
            </InfiniteScroll>;
        } else if(this.props.search.value == '') {
            renderElements = <div className='loading-block'><br /><h4>Loading...</h4></div>;
        }

        return(
            <div className="container-block" id="all-posts">
                {renderElements}
            </div>
        );
    }
}

Feed.propTypes = {
  search: PropTypes.object.isRequired
};

Feed.contextTypes = {
  store: React.PropTypes.object
};

const mapStateToProps = (state, props) => {
  return {
    localization: state.localization,
    search: state.search,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Feed);