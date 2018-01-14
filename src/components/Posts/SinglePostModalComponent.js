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
import AvatarComponent from '../Atoms/AvatarComponent';
import LikesComponent from '../Posts/LikesComponent';
import ShowMore from 'react-show-more';
import TimeAgo from 'timeago-react';

import Constants from '../../common/constants';

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
            isDescriptionOpened : false,
            adultParam : false,
            moneyParam : true,
            lowParam : false,
            closeParam : false,
            ...this.props
        }
        this.mobileCoverParams ={
          width: '100%',
          height: '100%'
        }
    }

    sharedComponentTitle() {
      let title = this.state.item.title.split('');
      title[0] = title[0].toUpperCase();
      document.title = `${title.join('')} | Steepshot`;
    }

    controlRestrictions() {
      if (this.state.item.is_nsfw) {
        this.setState({adultParam : true});
      } else {
        this.setState({adultParam : false});
      }
      if (this.state.item.total_payout_reward == 0) {
        this.setState({moneyParam : false});
      }
      if (this.state.item.is_low_rated) {
        this.setState({lowParam : true});
      } else {
        this.setState({lowParam : false});
      }
    }

    hideFunc() {
      this.setState({adultParam : false, lowParam : false});
    }

    closeButtonFunc() {
      if (document.documentElement.clientWidth <= 815) {
        this.setState({closeParam : true});
      } else {
        this.setState({closeParam : false});
      }
    }

    componentDidMount() {
        this.setState({needsCommentFormLoader : false});
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
                });
                this.sharedComponentTitle();
            } else {
                this.error();
            }
            this.controlRestrictions();
        });
        this.closeButtonFunc();
        window.addEventListener('resize', () => {
            this.closeButtonFunc();
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
      let comment = this.commentInput.value;
      if (comment == '') return false;

      const urlObject = this.state.item.url.split('/');

      const callback = (err, success) => {
        this.setState({
          needsCommentFormLoader : false
        });
        if (err) {
          jqApp.pushMessage.open(err);
        } else
        if (success) {
            this.setState({
              newComment : {
                net_votes : 0,
                vote : false,
                avatar : this.props.avatar,
                author : this.props.username,
                total_payout_value : 0,
                body : comment,
                created : Date.now()
              },
            }, () => {
                this.commentInput.value = '';
                this.scrollView.scrollBar.scrollToBottom();
                jqApp.pushMessage.open(Constants.COMMENT_SUCCESS_MESSAGE);
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
          this.commentInput.value,
          this.state.item.tags,
          callback
        );
      });
    }

    setDefaultImage() {
      this.setState({
        image: constants.NO_IMAGE
      });
    }

    // updateVoteInComponent(vote, index) {
    //     let newItem = this.state.item;
    //     if (vote && newItem.flag) {
    //         newItem.flag = false;
    //     }
    //     vote ? newItem.net_votes++ : newItem.net_votes--;
    //     newItem.vote = vote;
    //     this.setState({
    //         item: newItem
    //     });
    // }

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
          image: newItem.body,
          item: newItem,
          index: this.state.index + indexUpdater
      });
    }

    callPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    renderDescription() {
        let descriptionStart = this.state.item.description.replace(/(<\w+>)+/, '');
        let description = descriptionStart.replace(/\n[\w\W]+/, '');
        let forceOpen = false;
        this.state.item.tags.map(tag => description = description + ' #' + tag);
        if (description.length < 140) forceOpen = true;
        return (
          <div className="post-description">
            <p>{this.state.item.title}</p>
            <div
              className={(this.state.isDescriptionOpened || forceOpen) ? "collapse-opened" : "collapse-closed"}
            >
                {description + ' '}
                {
                  this.state.item.tags.map((tag, index) => {
                    return <span key={index}><TagComponent tag={tag}/> </span>
                  })
                }
                <a className="lnk-more" onClick={this.openDescription.bind(this)}>Show more</a>
            </div>
          </div>
        )
    }

    openDescription() {
        this.setState({isDescriptionOpened : true});
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.index != nextState.index)
        if (this.state.isDescriptionOpened) this.setState({ isDescriptionOpened : false });
        return true;
    }

    render() {
        if (!this.state.isPostLoading && !this.state.error) {
            let itemImage = this.state.item.body || constants.NO_IMAGE;
            let isUserAuth = (this.props.username && this.props.postingKey)
            const authorLink = `/@${this.state.item.author}`;

            this.initLayout();

            return(
                <div>
                    <div className="post-single">
                        {
                          this.state.closeParam
                            ?
                            <div className="crossWrapper">
                              <div className="user-wrap clearfix">
                                <div className="date">
                                  <TimeAgo
                                    datetime={this.state.item.created}
                                    locale='en_US'
                                  />
                                </div>
                                <Link to={authorLink} className="user">
                                  <AvatarComponent src={this.state.item.avatar} />
                                  <div className="name">{this.state.item.author}</div>
                                </Link>
                                <i data-dismiss="modal" className="modalButton" aria-hidden="true"></i>
                              </div>
                            </div>
                            :
                            null
                        }
                        <div className="post-wrap post">
                            <div className="post__image-container position--relative">
                              {
                                this.state.adultParam
                                  ?
                                  <div style={this.mobileCoverParams}>
                                    <div className="forAdult2">
                                      <div className="forAdultInner">
                                        <p className="par1">NSFW content</p>
                                        <p className="par2">This content is for adults only. Not recommended for children or sensitive individuals.</p>
                                        <button className="btn btn-index" onClick={this.hideFunc.bind(this)}>Show me</button>
                                      </div>
                                    </div>
                                    <img src={itemImage} alt="Post picture."/>
                                  </div>
                                  :
                                  this.state.lowParam
                                    ?
                                    <div style={this.mobileCoverParams}>
                                      <div className="forAdult2">
                                        <div className="forAdultInner">
                                          <p className="par1">Low rated content</p>
                                          <p className="par2">This content is hidden due to low ratings.</p>
                                          <button className="btn btn-index" onClick={this.hideFunc.bind(this)}>Show me</button>
                                        </div>
                                      </div>
                                      <img src={itemImage} alt="Post picture."/>
                                    </div>
                                    :
                                    <div>
                                      <ShareComponent
                                        moneyParam={this.state.moneyParam}
                                        url={this.state.item.url}
                                        title="Share post"
                                        containerModifier="block--right-top box--small post__share-button"
                                      />
                                      <img src={itemImage} alt="Post picture."/>
                                    </div>
                              }
                            </div>
                            <div className="post__description-container">
                                {
                                  this.state.closeParam
                                  ?
                                    null
                                  :
                                    <div className="user-wrap clearfix">
                                      <div className="date">
                                        <TimeAgo
                                          datetime={this.state.item.created}
                                          locale='en_US'
                                        />
                                      </div>
                                      <Link to={authorLink} className="user">
                                        <AvatarComponent src={this.state.item.avatar} />
                                        <div className="name">{this.state.item.author}</div>
                                      </Link>
                                    </div>
                                }
                                <div className="post-controls clearfix">
                                    <div className="buttons-row" onClick={(e)=>{this.callPreventDefault(e)}}>
                                        <VouteComponent
                                            key="vote"
                                            item={this.state.item}
                                            index={this.state.index}
                                            parent='post'
                                            updateVoteInComponent={this.updateVoteInComponent}
                                        />
                                        <FlagComponent
                                            key="flag"
                                            item={this.state.item}
                                            index={this.state.index}
                                            updateFlagInComponent={this.props.updateFlagInComponent}
                                        />
                                    </div>
                                    <div className="wrap-counts clearfix">
                                        <LikesComponent likes={this.state.item.net_likes} url={this.state.item.url} />
                                        {
                                          this.state.moneyParam
                                          ?
                                            <div className="amount">
                                              {utils.currencyChecker(this.state.item.total_payout_reward)}
                                            </div>
                                          :
                                            null
                                        }
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
                                    <Comments key="comments" replyUser={this.commentInput} item={this.state.item} newComment={this.state.newComment} />
                                </ScrollViewComponent>
                                {
                                isUserAuth
                                ?
                                    <div className="post-comment">
                                        <form className="comment-form form-horizontal">
                                                <div className="form-group clearfix">
                                                  {
                                                    this.state.needsCommentFormLoader
                                                      ?
                                                      <div className="loaderInComments">
                                                        <LoadingSpinner show={this.state.needsCommentFormLoader} />
                                                      </div>
                                                      :
                                                      <div className="btn-wrap">
                                                        <button type="submit" className="btn-submit" onClick={this.sendComment.bind(this)}>Send</button>
                                                      </div>
                                                  }
                                                <div className="input-container">
                                                    <textarea
                                                        ref={ (ref) => {this.commentInput = ref} }
                                                        id="formCOMMENT"
                                                        name="commentValue"
                                                        maxLength={2048}
                                                        className="form-control"
                                                    />
                                                    <label htmlFor="formCOMMENT" className="name">Comment</label>
                                                </div>
                                            </div>
                                        </form>
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
