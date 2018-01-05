import React from 'react';
import ReactDOM from 'react-dom';
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
import LoadingSpinner from '../LoadingSpinner';
import ScrollViewComponent from '../Common/ScrollViewComponent';
import TagComponent from './TagComponent';
import AvatarComponent from '../Atoms/AvatarComponent';
import TimeAgo from 'timeago-react';
import {Collapse} from 'react-collapse';
import Constants from '../../common/constants';

import utils from '../../utils/utils';
import ShowIf from '../Common/ShowIf';

const START_TEXTAREA_HEIGHT= '42px';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avatar : this.props.item.avatar,
            item : this.props.item,
            index : this.props.index,
            initialIndex : this.props.index,
            image : this.props.item.body,
            items : this.props.items,
            comments : [],
            disableNext : false,
            disablePrev : false,
            redirectToReferrer : false,
            needsCommentFormLoader : false,
            isLoading : false,
            hasMore : this.props.hasMore,
            loadMore : this.props.loadMore,
            adultParam : false,
            moneyParam : true,
            lowParam : false,
            closeParam : false,
            mirrorData : '',
            txtHeight : START_TEXTAREA_HEIGHT
        };
        this.mobileCoverParams ={
          width: '100%',
          height: '100%'
        }
        this.initKeypress();
    }

    needMore() {
      this.controlRestrictions();
      if (this.state.isLoading || !this.state.hasMore) return false;
      const curIndex = this.state.index;
      if (curIndex + 7 >= this.state.items.length) {
        this.setState({
          isLoading : true
        }, () => {
          this.state.loadMore();
        });
      }
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

    openLikesModal() {
      this.props.dispatch({ type : 'CLEAR_LIKES_INFO', url : this.state.item.url });
      jqApp.openLikesModal($(document));
    }

    likeCheck() {
      let like = this.state.item.net_votes;
      if (like == 0) {
        return false
      } else if (like == 1 || like == -1) {
        like = `${like} like`
      } else {
        like = `${like} likes`
      }
      return (
        <div className="likes" onClick={this.openLikesModal.bind(this)}>{like}</div>
      )
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

      this.liveTextArea();
    }

    liveTextArea() {
      this.setState({mirrorData : this.commentInput.value}, () => {
        if (this.hiddenDiv != undefined) {
          this.setState({txtHeight : this.hiddenDiv.clientHeight + 'px'});
        } else {
          this.setState({txtHeight : START_TEXTAREA_HEIGHT});
        }
      });
    }

    moneyCheck() {
      let money = this.state.item.total_payout_reward;
      if (money == 0) {
        return false
      }
      return (
        <div>{utils.currencyChecker(money)}</div>
      )
    }

    clearNewComment(callback) {
      this.setState({
        newComment : null,
        txtHeight : START_TEXTAREA_HEIGHT
      }, () => callback ? callback() : false);
    }

    componentWillReceiveProps(nextProps) {
      let isLoading = this.state.isLoading;
      if (isLoading)
      if (this.state.items != nextProps.items) {
        isLoading = false;
      }
      this.setState({
        item : nextProps.index == this.state.initialIndex ? this.state.item : nextProps.item,
        items : nextProps.items,
        index: nextProps.index == this.state.initialIndex ? this.state.index : nextProps.index,
        initialIndex : nextProps.index,
        comments : [],
        disableNext : false,
        disablePrev : false,
        redirectToReferrer : false,
        newComment : null,
        isLoading : isLoading
      }, () => {
        this.needMore();
      });
    }

    componentDidMount() {
      this.needMore(this.props);
      setTimeout(() => {
        jqApp.forms.init();
      }, 0);
      this.closeButtonFunc();
      window.addEventListener('resize', () => {
        this.closeButtonFunc();
      });
    }

    hideFunc() {
      this.setState({adultParam : false, lowParam : false});
    }

    clearCommentInput() {
      this.commentInput.value = '';
      this.formGr.classList.remove('not-empty');
    }

    sendComment(e) {
      e.preventDefault();
      let comment = this.commentInput.value;
      if (comment == '') return false;

      const urlObject = this.state.item.url.split('/');

      const callback = (err, success) => {
        this.setState({
          needsCommentFormLoader : false,
          txtHeight : START_TEXTAREA_HEIGHT
        });
        if (err) {
          jqApp.pushMessage.open(err);
          this.commentInput.value = '';
        } else if (success) {
            this.setState({
              newComment : {
                net_votes : 0,
                vote : false,
                avatar : this.props.avatar,
                author : this.props.username,
                total_payout_value : 0,
                body : comment,
                created : Date.now()
              }
            }, () => {
              jqApp.pushMessage.open(Constants.COMMENT_SUCCESS_MESSAGE);
              this.scrollView.scrollBar.scrollToBottom();
            });
        }
        this.clearCommentInput();
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
      }
    }

    setDefaultImage() {
      this.setState({
        image: constants.NO_IMAGE
      });
    }

    next() {
      if (this.state.index < this.state.items.length - 1) {
        this.clearCommentInput();
        this.clearNewComment(this.resetDefaultProperties(this.state.items[this.state.index + 1], 1));
      }
    }

    previous() {
      if (this.state.index > 0) {
        this.clearCommentInput();
        this.clearNewComment(this.resetDefaultProperties(this.state.items[this.state.index - 1], -1));
      }
    }

    resetDefaultProperties(newItem, indexUpdater) {
      this.setState({
        item: newItem,
        index: this.state.index + indexUpdater
      });
      this.needMore();
    }

    redirectToLoginPage() {
      this.props.history.push('/signin');
    }

    callPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    openDescription() {
      this.setState({isDescriptionOpened : true});
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.state.index != nextState.index)
      if (this.state.isDescriptionOpened) this.setState({ isDescriptionOpened : false });
      return true;
    }

    userLinkFunc(a) {
      let description = null;
      if (a) {
        description = this.state.item.title;
      } else {
        let descriptionStart = this.state.item.description.replace(/(<\w+>)+/, '');
        description = descriptionStart.replace(/\n[\w\W]+/, '');
      }
      if (description.match(/@\w+/g)) {
        let arr = description.split(' ').map( (item, index) => {
          if (/@\w+\S/.test(item)) {
            let lowItem = item.toLowerCase();
            let replace1 = lowItem.replace(/(@[\w-.]+\w)/g, ' $1 ');
            let replace2 = replace1.match(/\s(@[\w-.]+)\s/g);
            let replace3 = replace1.match(/([\w\W]+)\s@/g);
            let replace4 = replace1.match(/\w\s([^@]+)/g);
            let replace5 = lowItem.match(/@[\w.]+[\W]/);
            let replaceDot = replace2[0].match(/@\w+\.\s/);
            return <span key={index}>
                   <span>
                     {
                       replace3
                         ?
                         replace3[0].replace(/\s@/g, '')
                         :
                         null
                     }
                   </span>
                   <Link to={`/${
                     replaceDot
                       ?
                       replace2[0].replace(/\s(@\w+)\.\s+/g, '$1')
                       :
                       replace2[0].replace(/\s+/g, '')}`
                   }>
                     {
                       replaceDot
                         ?
                         replace2[0].replace(/\.\s+/g, '')
                         :
                         replace5
                           ?
                           replace2[0].replace(/\s+/g, '')
                           :
                           replace2[0].replace(/\s+/g, '') + ' '
                     }
                   </Link>
                   <span>
                     {
                       replace4
                         ?
                         replace4[0].replace(/\w\s/, '') + ' '
                         :
                         replaceDot
                           ?
                           '. '
                           :
                           ' '
                     }
                   </span>
                 </span>
          } else {
            return item + ' '
          }
        });
        return (
          <span>
          {arr}
        </span>
        )
      } else {
        return (
          <span>
            {description + ' '}
          </span>
        )
      }
    }

    renderDescription() {
      let forceOpen = false;
      let descriptionStart = this.state.item.description.replace(/(<\w+>)+/, '');
      if (descriptionStart.replace(/\n[\w\W]+/, '').length < 140) forceOpen = true;
      return (
        <div className="post-description">
          <p>{this.userLinkFunc(true)}</p>
          <div
            className={(this.state.isDescriptionOpened || forceOpen) ? "collapse-opened" : "collapse-closed"}
          >
              {this.userLinkFunc(false)}
              {
                this.state.item.tags.map((tag, index) => {
                  return <span key={index}><TagComponent tag={tag} /> </span>
                })
              }
              <a className="lnk-more" onClick={this.openDescription.bind(this)}>Show more</a>
          </div>
        </div>
      )
    }

    closeButtonFunc() {
      if (document.documentElement.clientWidth <= 815) {
        this.setState({closeParam : true});
      } else {
        this.setState({closeParam : false});
      }
    }

    render() {
      let itemImage = this.state.item.body || constants.NO_IMAGE;
      let isUserAuth = (this.props.username && this.props.postingKey);
      const authorLink = `/@${this.state.item.author}`;

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
                    <div data-dismiss="modal" className="modalButtonWrapper">
                      <i className="modalButton" aria-hidden="true"></i>
                    </div>
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
                      key='vote'
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
                    <div className="likeMoneyPopup">
                      {this.likeCheck()}
                      {this.moneyCheck()}
                    </div>
                  </div>
                </div>
                <ScrollViewComponent
                  ref={ (ref) => this.scrollView = ref }
                  wrapperModifier="list-scroll"
                  scrollViewModifier="list-scroll__view"
                  autoHeight={window.innerWidth < constants.DISPLAY.DESK_BREAKPOINT}
                  autoHeightMax={350}
                  autoHeightMin={100}
                  autoHide={true}
                >
                  {this.renderDescription()}
                  <Comments
                    key="comments"
                    item={this.state.item}
                    newComment={this.state.newComment}
                    replyUser={this.commentInput}
                  />
                </ScrollViewComponent>
                {
                  isUserAuth
                  ?
                    <div className="post-comment">
                      <div className="comment-form form-horizontal">
                        <div className="form-group clearfix" ref={ (ref) => {this.formGr = ref} }>
                          {
                            this.state.needsCommentFormLoader
                            ?
                              <div className="loaderInComments">
                                <LoadingSpinner />
                              </div>
                              :
                              <div className="btn-wrap">
                                <button
                                  type="submit"
                                  className="btn-submit"
                                  onClick={this.sendComment.bind(this)}
                                  ref={ ref => {this.sendButton = ref} }
                                  >Send</button>
                              </div>
                          }
                          <div className="input-container">
                            <textarea
                              ref={ (ref) => {this.commentInput = ref} }
                              style={{height : this.state.txtHeight}}
                              id="formCOMMENT"
                              name="commentValue"
                              maxLength={2048}
                              className="form-control resize-textarea_item-mod"
                              onChange={this.lookTextarea.bind(this)}
                            />
                            <ShowIf show={!!this.state.mirrorData}>
                              <div className="hidden-div_item-mod" ref={ ref => {this.hiddenDiv = ref} }>
                                {this.state.mirrorData}
                              </div>
                            </ShowIf>
                            <label htmlFor="formCOMMENT" className="name">Comment</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  :
                    null
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
}

ItemModal.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
  return {
    reply: state.comment.author,
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey,
    avatar: state.auth.avatar
  };
};

export default connect(mapStateToProps)(ItemModal);
