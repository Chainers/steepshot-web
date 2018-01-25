import React from 'react';
import ReactDOM from 'react-dom';
import Steem from '../../libs/steem';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Comments from './Comments';
import constants from '../../common/constants';
import Constants from '../../common/constants';
import ShareComponent from './ShareComponent';
import LoadingSpinner from '../LoadingSpinner';
import ScrollViewComponent from '../Common/ScrollViewComponent';
import TagComponent from './TagComponent';
import AvatarComponent from '../Atoms/AvatarComponent';
import TimeAgo from 'timeago-react';

import utils from '../../utils/utils';
import ShowIf from '../Common/ShowIf';
import {UserLinkFunc} from '../Common/UserLinkFunc';
import Vote from '../PostsList/Post/Vote/Vote';
import Flag from '../PostsList/Post/Flag/Flag';
import {closeModal, openModal} from '../../actions/modal';
import PostContextMenu from '../PostContextMenu/PostContextMenu';

const START_TEXTAREA_HEIGHT = '42px';

class ItemModal extends React.Component {
  constructor(props) {
    super(props);

    this.mobileCoverParams = {
      width: '100%',
      height: '100%',
    };
    this.state = {
      newComment: null,
      needsCommentFormLoader: false,
      isDescriptionOpened: false,
      showMe: true,
    };
    this.initKeypress();
    this.showMe = this.showMe.bind(this);
    this.openPostModal = this.openPostModal.bind(this);
  }

  showMe() {
    this.setState({
      showMe: false,
    });
  }

  needMore() {
    if (this.props.item.loading || !this.props.item.hasMore) return false;
    const curIndex = this.props.currentIndex;
    if (curIndex + 7 >= this.props.items.length) {
      this.props.loadMore();
    }
    return true;
  }

  openLikesModal() {
    this.props.dispatch({type: 'CLEAR_LIKES_INFO', url: this.props.item.url});
    jqApp.openLikesModal($(document));
  }

  likeCheck() {
    let like = this.props.item.net_votes;
    if (like == 0) {
      return false;
    } else if (like == 1 || like == -1) {
      like = `${like} like`;
    } else {
      like = `${like} likes`;
    }
    return (
      <div className="likes" onClick={this.openLikesModal.bind(this)}>{like}</div>
    );
  }

  lookTextarea() {
    let firstSpace = this.commentInput.value.match(/\s+/);
    if (firstSpace && firstSpace['index'] == 0) {
      this.commentInput.value = '';
    } else if (this.commentInput.value != '') {
      this.sendButton.classList.add('send-button_item-mod');
    } else {
      this.sendButton.classList.remove('send-button_item-mod');
    }
    this.hiddenDiv.textContent = this.commentInput.value;
    this.setState({tmp: 1});
  }

  clearNewComment(callback) {
    this.setState({
      newComment: null,
    }, () => callback ? callback() : false);
  }

  componentDidMount() {
    setTimeout(() => {
      jqApp.forms.init();
    }, 0);
  }

  clearCommentInput() {
    this.commentInput.value = '';
    this.formGr.classList.remove('not-empty');
  }

  sendComment(e) {
    e.preventDefault();
    let comment = this.commentInput.value;
    if (comment == '') return false;

    const urlObject = this.props.item.url.split('/');

    const callback = (err, success) => {
      this.setState({
        needsCommentFormLoader: false,
      });
      if (err) {
        jqApp.pushMessage.open(err);
        this.commentInput.value = '';
      } else if (success) {
        this.setState({
          newComment: {
            net_votes: 0,
            vote: false,
            avatar: this.props.avatar,
            author: this.props.username,
            total_payout_value: 0,
            body: comment,
            created: Date.now(),
          },
        }, () => {
          jqApp.pushMessage.open(Constants.COMMENT_SUCCESS_MESSAGE);
          this.scrollView.scrollBar.scrollToBottom();
        });
      }
      this.clearCommentInput();
    };

    this.setState({
      needsCommentFormLoader: true,
    }, () => {
      Steem.comment(
        this.props.postingKey,
        this.props.item.author,
        urlObject[urlObject.length - 1],
        this.props.username,
        this.commentInput.value,
        this.props.item.tags,
        callback,
      );
    });
  }

  initKeypress() {
    document.onkeydown = (e) => {
      if (document.activeElement !== ReactDOM.findDOMNode(this.commentInput)) {
        switch (e.keyCode) {
          case 37:
            this.previous();
            break;
          case 39:
            this.next();
            break;
          default :
            break;
        }
      }
    };
  }

  setDefaultImage() {
    this.setState({
      image: constants.NO_IMAGE,
    });
  }

  openPostModal(postIndex) {
    let modalOption = {
      point: this.props.point,
      body: (<ItemModal
        point={this.props.point}
        index={postIndex}
        loadMore={this.getPostsList}
      />),
    };
    this.props.openModal(postIndex, modalOption);
  }

  next() {

  }

  previous() {

  }

  redirectToLoginPage() {
    this.props.history.push('/signin');
  }

  callPreventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  openDescription() {
    this.setState({isDescriptionOpened: true});
  }

  renderDescription() {
    let forceOpen = false;
    let descriptionStart = this.props.item.description.replace(/(<\w+>)+/, '');
    if (descriptionStart.replace(/\n[\w\W]+/, '').length <
      140) forceOpen = true;
    return (
      <div className="post-description">
        <p>{UserLinkFunc(true, this.props.item.title)}</p>
        <div
          className={(this.state.isDescriptionOpened || forceOpen)
            ? 'collapse-opened'
            : 'collapse-closed'}
        >
          {UserLinkFunc(false, this.props.item.description)}
          {
            this.props.item.tags.map((tag, index) => {
              return <span key={index}><TagComponent tag={tag}/> </span>;
            })
          }
          <a className="lnk-more" onClick={this.openDescription.bind(this)}>Show
            more</a>
        </div>
      </div>
    );
  }

  render() {
    let closeParam = document.documentElement.clientWidth <= 815;
    let itemImage = this.props.item.body || constants.NO_IMAGE;
    let isUserAuth = (this.props.username && this.props.postingKey);
    const authorLink = `/@${this.props.item.author}`;

    return (
      <div>
        <div className="post-single">
          <ShowIf show={closeParam}>
            <div className="crossWrapper">
              <div className="user-wrap clearfix">
                <div className="date">
                  <TimeAgo
                    datetime={this.props.item.created}
                    locale='en_US'
                  />
                </div>
                <Link to={authorLink} className="user">
                  <AvatarComponent src={this.props.item.avatar}/>
                  <div className="name">{this.props.item.author}</div>
                </Link>
                <div data-dismiss="modal" className="modalButtonWrapper">
                  <i className="modalButton" aria-hidden="true"></i>
                </div>
              </div>
            </div>
          </ShowIf>
          <div className="post-wrap post" style={{backgroundColor: '#FFF'}}>
            <div className="post__image-container position--relative">
              {
                this.props.item.is_nsfw && this.state.showMe
                  ? <div style={this.mobileCoverParams}>
                    <div className="forAdult2">
                      <div className="forAdultInner">
                        <p className="par1">NSFW content</p>
                        <p className="par2">This content is for adults only. Not
                          recommended for children or sensitive individuals.</p>
                        <button className="btn btn-index"
                                onClick={this.showMe}>Show me
                        </button>
                      </div>
                    </div>
                    <img src={itemImage} alt="Post picture."/>
                  </div>
                  : this.props.item.is_low_rated && this.state.showMe
                  ? <div style={this.mobileCoverParams}>
                    <div className="forAdult2">
                      <div className="forAdultInner">
                        <p className="par1">Low rated content</p>
                        <p className="par2">This content is hidden due to low
                          ratings.</p>
                        <button className="btn btn-index"
                                onClick={this.showMe}>Show me
                        </button>
                      </div>
                    </div>
                    <img src={itemImage} alt="Post picture."/>
                  </div>
                  : <div>
                    <ShareComponent
                      moneyParam={this.props.item.total_payout_reward != 0}
                      url={this.props.item.url}
                      title="Share post"
                      containerModifier="block--right-top box--small post__share-button"
                    />
                    <img src={itemImage} alt="Post picture."/>
                  </div>
              }
            </div>
            <div className="post__description-container">
              {
                closeParam
                  ? null
                  : <div className="user-wrap clearfix">
                    <div className="date">
                      <TimeAgo
                        datetime={this.props.item.created}
                        locale='en_US'
                      />
                    </div>
                    <PostContextMenu style={{float: 'left', height: '22px'}}
                                     item={this.props}
                                     index={this.props.index}
                    />
                    <Link to={authorLink} className="user">
                      <AvatarComponent src={this.props.item.avatar}/>
                      <div className="name">{this.props.item.author}</div>
                    </Link>
                  </div>
              }
              <div className="post-controls clearfix">
                <div className="buttons-row"
                     onClick={(e) => {this.callPreventDefault(e);}}>
                  <Vote postIndex={this.props.index}/>
                  <Flag postIndex={this.props.index}/>
                </div>
                <div className="wrap-counts clearfix">
                  <div className="likeMoneyPopup">
                    {this.likeCheck()}
                    <ShowIf show={this.props.item.total_payout_reward != 0}>
                      <div>{utils.currencyChecker(
                        this.props.item.total_payout_reward)}</div>
                    </ShowIf>
                  </div>
                </div>
              </div>
              <ScrollViewComponent
                ref={(ref) => this.scrollView = ref}
                wrapperModifier="list-scroll"
                scrollViewModifier="list-scroll__view"
                autoHeight={window.innerWidth <
                constants.DISPLAY.DESK_BREAKPOINT}
                autoHeightMax={350}
                autoHeightMin={100}
                autoHide={true}
              >
                {this.renderDescription()}
                <Comments
                  key="comments"
                  item={this.props.item}
                  newComment={this.state.newComment}
                  replyUser={this.commentInput}
                />
              </ScrollViewComponent>
              {
                isUserAuth
                  ? <div className="post-comment">
                    <div className="comment-form form-horizontal">
                      <div className="form-group clearfix"
                           ref={(ref) => {this.formGr = ref;}}>
                        {
                          this.state.needsCommentFormLoader
                            ? <div className="loaderInComments">
                              <LoadingSpinner/>
                            </div>
                            : <div className="btn-wrap">
                              <button
                                type="submit"
                                className="btn-submit"
                                onClick={this.sendComment.bind(this)}
                                ref={ref => {this.sendButton = ref;}}
                              >Send
                              </button>
                            </div>
                        }
                        <div className="input-container">
                            <textarea
                              ref={(ref) => {this.commentInput = ref;}}
                              style={{
                                height: this.hiddenDiv != undefined
                                  ? this.hiddenDiv.clientHeight + 'px'
                                  : START_TEXTAREA_HEIGHT,
                              }}
                              id="formCOMMENT"
                              name="commentValue"
                              maxLength={2048}
                              className="form-control resize-textarea_item-mod"
                              onChange={this.lookTextarea.bind(this)}
                            />

                            <div className="hidden-div_item-mod" ref={ref => {this.hiddenDiv = ref}}/>
                            <label htmlFor="formCOMMENT" className="name">Comment</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    modals: state.modals,
    items: state.postsList[props.point].postsIndices,
    item: state.posts[props.index],
    currentIndex: state.postsList[props.point].postsIndices.indexOf(
      props.index),
    reply: state.comment.author,
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey,
    avatar: state.auth.avatar,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    closeModal: (index) => {
      dispatch(closeModal(index));
    },
    openModal: (index, options) => {
      dispatch(openModal(index, options))
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(ItemModal);
