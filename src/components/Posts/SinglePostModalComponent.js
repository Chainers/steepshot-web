import React from 'react';
import Steem from '../../libs/steem';
import {
  Link,
  Redirect
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import Comments from './Comments';
import PropTypes from 'prop-types';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';
import AddComment from './AddComment';
import FlagComponent from './FlagComponent';
import ShareComponent from './ShareComponent';
import ScrollViewComponent from '../Common/ScrollViewComponent';
import TagComponent from './TagComponent';
import LoadingSpinner from '../LoadingSpinner';

import {
    getPostShaddow
} from '../../actions/posts';

import utils from '../../utils/utils';

class SinglePostModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notify : this.props.notify,
            isPostLoading : true,
            ...this.props
        }
    }

    componentDidMount() {
        const urlObject = this.props.location.pathname.split('/');
        if (urlObject.length < 3) {
            this.error();
        } else 
        getPostShaddow(this.getPostIdentifier(urlObject[urlObject.length - 2], urlObject[urlObject.length - 1]))
        .then((result) => {
            if (result) {
                this.setState({
                    item : result,
                    isPostLoading : false
                }, () => {
                    const callbackClose = () => {
                        jqApp.data.callback = undefined;
                        if (!(this.props.username && this.props.postingKey)) {
                            this.props.history.push('/browse');
                        } else {
                            this.props.history.push('/feed');
                        }
                    }
                    jqApp.data = {} || jqApp.data;
                    jqApp.data.callback = {} || jqApp.data.callback;
                    jqApp.data.callback = callbackClose.bind(this);
                    jqApp.openPostModal();
                })
            } else {
                this.error();
            }
        });
    }

    error() {
        jqApp.pushMessage.open('Something went wrong, please, check the URL or try again later');
        setTimeout(() => {
            if (!(this.props.username && this.props.postingKey)) {
                this.props.history.push('/browse');
            } else {
                this.props.history.push('/feed');
            }
        }, 3000);
    }

    initLayout() {
        setTimeout(() => { 
            jqApp.forms.init();
        }, 0);
    }

    getPostIdentifier(author, permlink) {
        return `${author}/${permlink}`;
    }

    sendComment(e) {
      e.preventDefault();

      if (this.state.commentValue == "") return false;

      const urlObject = this.state.item.url.split('/');

      const callback = (err, success) => {
        this.setState({
          needsCommentFormLoader : false
        });
        if (err) {
          let text = 'Something went wrong, please, try again later';
          if (err.payload.error.data.code == 10) {
            text = 'Sorry, you had used the maximum number of comments on this post';
          }
          jqApp.pushMessage.open(text);
        } else 
        if (success) {
            this.setState({
              newComment : {
                net_votes : 0,
                vote : false,
                avatar : this.props.avatar,
                author : this.props.username,
                total_payout_value : 0,
                body : this.state.commentValue,
                created : Date.now()
              },
              commentValue : ''
            }, () => {
                this.scrollView.scrollBar.scrollToBottom();
                let text = 'Comment was successfully added';
                jqApp.pushMessage.open(text);
            });
        }
      }

      this.setState({
        needsCommentFormLoader : true
      }, () => {
        Steem.comment(
          this.props.postingKey,             
          this.state.item.author, 
          urlObject[urlObject.length - 1], 
          this.props.username, 
          this.state.commentValue,
          this.state.item.tags,
          callback
        );
      });
    }

    setDefaultAvatar() {
      this.setState({ 
        avatar: constants.NO_AVATAR 
      });
    }

    setDefaultImage() {
      this.setState({
        image: constants.NO_IMAGE
      });
    }

    handleChange(event) {
      let name = event.target.name;
      let value = event.target.value;
      this.setState({ 
          [name] : value
      });
    }

    updateVoteInComponent(vote, index) {
        let newItem = this.state.item;
        if (vote && newItem.flag) {
            newItem.flag = false;
        }
        vote ? newItem.net_votes++ : newItem.net_votes--;
        newItem.vote = vote;
        this.setState({ 
            item: newItem
        });
    }
    
    updateFlagInComponent(flag, index) {
        let newItem = this.state.item;
        if (flag && newItem.vote) {
            newItem.net_votes--;
            newItem.vote = false;
        }
        newItem.flag = flag;
        this.setState({ 
            item: newItem
        });
    }

    resetDefaultProperties(newItem, indexUpdater) {
      this.setState({ 
          avatar: newItem.avatar,
          image: newItem.body,
          item: newItem,
          index: this.state.index + indexUpdater
      });
    }

    getFormatedDate() {
      const date = new Date(this.state.item.created);
      const locale = "en-us";
  
      return date.getDate() + ' ' + date.toLocaleString(locale, { month: "short" }) + ' ' + date.getFullYear();
    }

    callPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    renderDescription() {
        return (
          <div className="post-description">
            <p>{this.state.item.title}</p>
            <div className="post-tags clearfix">
              {
                this.state.item.tags.map((tag, index) => <TagComponent tag={tag} key={index}/>)
              }
            </div>
          </div>
        )
    }

    render() {

        if (!this.state.isPostLoading && !this.state.error) {
    
            let _this = this;
            let itemImage = this.state.item.body || constants.NO_IMAGE;
            let authorImage = this.state.item.avatar || constants.NO_AVATAR;

            let isUserAuth = (this.props.username && this.props.postingKey);

            const authorLink = `/@${this.state.item.author}`;

            this.initLayout();

            return(
                <div>
                    <div className="post-single">
                        <div className="post-wrap post">
                            <div className="post__image-container position--relative">
                                <ShareComponent 
                                    url={this.state.item.url}
                                    title="Share post"
                                    containerModifier="block--right-top box--small post__share-button"
                                />
                                <img src={itemImage} 
                                    onError={this.setDefaultImage.bind(this)} 
                                    alt="image" 
                                />
                            </div>
                            <div className="post__description-container">
                                <div className="post-header">
                                    <div className="user-wrap clearfix">
                                        <div className="date">{this.getFormatedDate()}</div>
                                            <Link to={authorLink} className="user">
                                                <div className="photo">
                                                    <img 
                                                        src={authorImage} 
                                                        alt="Image" 
                                                        onError={this.setDefaultAvatar.bind(this)} 
                                                    />
                                                </div>
                                                <div className="name">{this.state.item.author}</div>
                                            </Link>
                                    </div>
                                </div>
                                <div className="post-controls clearfix">
                                    <div className="buttons-row" onClick={(e)=>{this.callPreventDefault(e)}}>
                                        <VouteComponent key="vote" 
                                            key="vote"
                                            item={this.state.item}
                                            index={this.state.index}
                                            updateVoteInComponent={this.props.updateVoteInComponent}
                                            parent='post'
                                        />
                                        <FlagComponent 
                                            key="flag"
                                            item={this.state.item}
                                            index={this.state.index}
                                            updateFlagInComponent={this.props.updateFlagInComponent}
                                        />
                                    </div>
                                    <div className="wrap-counts clearfix">
                                        <div className="likes">{this.state.item.net_votes} like's</div>
                                        <div className="amount">
                                            {utils.currencyChecker(this.state.item.total_payout_reward)}
                                        </div>
                                    </div>
                                </div>
                                <ScrollViewComponent 
                                    ref={(ref) => this.scrollView = ref}
                                    wrapperModifier="list-scroll"
                                    scrollViewModifier="list-scroll__view"
                                    autoHeight={window.innerWidth < constants.DISPLAY.DESK_BREAKPOINT}
                                    autoHeightMax={350}
                                    autoHeightMin={100}
                                    autoHide={true}
                                >
                                    {this.renderDescription()}
                                    <Comments key="comments" item={this.state.item} newComment={this.state.newComment}/>
                                </ScrollViewComponent>
                                {
                                isUserAuth
                                ?
                                    <div className="post-comment">
                                        <form className="comment-form form-horizontal">
                                                <div className="form-group clearfix">
                                                    <div className="btn-wrap">
                                                        <button type="submit" className="btn-submit" onClick={this.sendComment.bind(this)}>Send</button>
                                                    </div>
                                                <div className="input-container">
                                                    <textarea 
                                                        ref="commentInput"
                                                        id="formCOMMENT" 
                                                        name="commentValue"
                                                        value={this.state.commentValue}
                                                        maxLength={2048}
                                                        className="form-control"
                                                        onChange={this.handleChange.bind(this)}
                                                    />
                                                    <label htmlFor="formCOMMENT" className="name">Comment</label>
                                                </div>
                                            </div>
                                        </form>
                                    {
                                        this.state.needsCommentFormLoader
                                        ?
                                        <LoadingSpinner />
                                        :
                                        null
                                    }
                                    </div>
                                :
                                    null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else return null;
    }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey,
    avatar: state.auth.avatar
  };
};

export default connect(mapStateToProps)(SinglePostModalComponent);