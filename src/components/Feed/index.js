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
import ModalComponent from '../Common/ModalComponent';

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
            _this.state.posts.pop();
            let newPosts = _this.state.posts.concat(response.results);
            
            let hasMore = !(_this.state.offset == response.offset);
            
            _this.setState({ 
                items: newPosts, 
                offset: response.offset,
                hasMore: hasMore,
                loading: false
            });
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
        return <ItemModal 
                    item={this.state.posts[this.state.currentItem]} 
                    items={this.state.posts} 
                    index={this.state.currentItem}
                    updateVoteInComponent={this.updateVoteInComponent.bind(this)} 
                    loadMore={this.fetchPostsNext.bind(this)}
                />
        return null;
    }

    openModal(index) {
        this.setState({
            currentItem : index
        },
            jqApp.openPostModal()
        );
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
                <ModalComponent>
                    {this._renderModal()}
                </ModalComponent>
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