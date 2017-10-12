import React from 'react';
import { 
    getUserFeed 
} from '../../actions/posts';
import PostItem from '../Posts/Item';
import {
    connect,
    store
} from 'react-redux';
import InfiniteScroll from '../Scroller/infinityScroll';
import PropTypes from 'prop-types';
import {
    getStore
} from '../../store/configureStore';
import LoadingSpinner from '../LoadingSpinner';
import ItemModal from '../Posts/ItemModal';

class Feed extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            hasMore: true,
            offset: null,
            loading: true
        };

        this.store = getStore();

        this.localConstants = {
            THIS_POST_MODAL_REF : "thisPostModal" + this.props.index
        }
    }

    componentDidMount() {
        this.loadUserPosts();
    }

    loadUserPosts() {
        this.setState({
            posts: [], 
            offset: null,
            loading: true
        });
        this.setUserPosts();
    }

    setUserPosts() {
        let _this = this;

        getUserFeed(this.props.user).then((response) => {
            _this.setState({
                posts: response.results, 
                offset: response.offset,
                loading: false
            });
        });
    }

    fetchPostsNext() {
        let _this = this;
        this.setState({
            loading: true
        });

        getUserFeed(this.props.user, this.state.offset).then((response) => {
            this.state.posts.pop();
            let newPosts = this.state.posts.concat(response.results);
            if (!response.offset) {
                _this.setState({
                    posts: newPosts, 
                    offset: response.offset, 
                    hasMore: false,
                    loading: false
                });
            } else {
                _this.setState({
                    posts: newPosts, 
                    offset: response.offset,
                    loading: false
                });
            }
        });
    }

    updateVoteInComponent(vote, index) {
        let newItems = this.state.posts;
        vote ? newItems[index].net_votes++ : newItems[index].net_votes--;
        newItems[index].vote = vote;
        this.setState({ 
          posts: newItems
        });
    }

    _renderModal() {
        if (this.state.currentItem != undefined)
        return <ItemModal item={this.state.posts[this.state.currentItem]} items={this.state.posts} index={this.state.currentItem}/>
        return null;
    }

    openModal(index) {
        let $context = $(this.refs[this.localConstants.THIS_POST_MODAL_REF]);
        this.setState({
            currentItem : index
        })
        jqApp.openPostModal($context);
    }

    render() {
        let items = [];
        let _this = this;
        let renderElements = <div className='loading-block'><LoadingSpinner /></div>;

        if (this.state.posts.length > 0) {
            this.state.posts.map((post, index) => {
                items.push(<PostItem
                    key={index + "_FeedPostItem"}
                    item={post}
                    items={_this.state.posts}
                    index={index}
                    history={this.props.history}
                    loadMore={this.fetchPostsNext.bind(this)}
                    openModal={this.openModal.bind(this)} 
                    updateVoteInComponent={this.updateVoteInComponent.bind(this)} />
                );
            });

            renderElements = items;
        } else if(this.props.search.value == '') {
            renderElements = <div className='loading-block'><LoadingSpinner /></div>;
        }

        return(
            <div className="g-main_i container">
                <div className="posts-list clearfix" id="all-posts">
                    {renderElements}
                </div>
                { 
                    this.state.hasMore && !this.state.loading ? 
                        <div className="load-more" onClick={this.fetchPostsNext.bind(this)}>
                        <button type="button" className="btn btn-index">Upload more posts</button>
                        </div> : null 
                }
                {
                    this.state.hasMore && this.state.loading && this.state.posts.length !== 0 ? 
                    <div className='loading-block'>
                        <LoadingSpinner />
                    </div> : null 
                }
                <div tabIndex="-1" role="dialog" aria-hidden="true" className="modal modal-post fade mScroll" ref={this.localConstants.THIS_POST_MODAL_REF}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="big-slider">
                                <div className="bs-wrap"> {/*not-init class*/}
                                    <div className="bs-slider">
                                        <div className="bs-slide">
                                            {this._renderModal()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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