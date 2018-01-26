import React from 'react';
import {connect} from 'react-redux';
import {
  nextPostModal, previousPostModal, setPostModalOptions,
} from '../../../actions/postModal';
import constants from '../../../common/constants';
import TimeAgo from 'timeago-react';
import {Link} from 'react-router-dom';
import Avatar from '../../Common/Avatar/Avatar';
import {closeModal, setModalOptions} from '../../../actions/modal';
import ShowIf from '../../Common/ShowIf';
import Flag from '../Post/Flag/Flag';
import Vote from '../Post/Vote/Vote';
import LikesComponent from '../../Posts/LikesComponent';
import {UserLinkFunc} from '../../Common/UserLinkFunc';
import Tags from '../Post/Tags/Tags';
import ScrollViewComponent from '../../Common/ScrollViewComponent';
import Comments from '../../Posts/Comments';
import LoadingSpinner from '../../LoadingSpinner';
import {sendComment} from '../../../actions/comment';
import {copyToClipboard} from '../../../actions/clipboard';
import ReactDOM from 'react-dom';

const START_TEXTAREA_HEIGHT = '42px';

class PostModal extends React.Component {

  constructor(props) {
    super(props);
    this.setComponentSize = this.setComponentSize.bind(this);
    this.initKeyPress();
  }

  componentDidMount() {
    window.addEventListener('resize', this.setComponentSize);
    this.hiddenDiv.style.width = this.textArea.clientWidth + 'px';
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setComponentSize);
  }

  componentDidUpdate() {
    this.scrollView.scrollBar.scrollToBottom();
  }

  openDescription() {
    this.props.setPostModalOptions({isDescriptionOpened: true});
  }

  initKeyPress() {
    document.onkeydown = (e) => {
      if (document.activeElement !== ReactDOM.findDOMNode(this.textArea)) {
        switch (e.keyCode) {
          case 37:
            this.props.previous(this.props.currentIndex);
            this.setCommentInput();
            break;
          case 39:
            this.props.next(this.props.currentIndex);
            this.setCommentInput();
            break;
          default :
            break;
        }
      }
    };
  }

  setCommentInput() {
    this.textArea.value = '';
    this.hiddenDiv.textContent = '';
    this.setComponentSize();
  }

  renderDescription() {
    let forceOpen = false;
    let descriptionStart = this.props.post.description.replace(/(<\w+>)+/, '');
    if (descriptionStart.replace(/\n[\w\W]+/, '').length < 140) forceOpen = true;

    return (
      <div className="text-description_pos-menu">
        <p>{UserLinkFunc(null, this.props.post.title)}</p>
        <div
          className={(this.props.isDescriptionOpened || forceOpen)
            ? 'collapse-opened'
            : 'collapse-closed'}
        >

          {UserLinkFunc(false, this.props.post.description)}
          <Tags tags={this.props.post.tags}/>
          <a className="lnk-more" onClick={this.openDescription.bind(this)}>Show more</a>
        </div>
      </div>);
  }

  changeText() {
    this.hiddenDiv.style.width = this.textArea.clientWidth;
    this.hiddenDiv.textContent = this.textArea.value;

    let label = '';
    let sendHover = '';
    if (this.textArea.value) {
      label = 'focused_pos-mod';
      sendHover = 'btn-hover_pos-mod';
    }
    this.props.setPostModalOptions({
      addCommentHeight: this.hiddenDiv.clientHeight,
      limitTop: this.descContainer.clientHeight,
      label,
      sendHover,
    });
  }

  sendComment(e) {
    e.preventDefault();
    let comment = this.textArea.value;
    if (comment === '') return false;
    this.props.sendComment(this.props.currentIndex, comment);
    this.textArea.value = '';
  }

  render() {
    const authorLink = `/@${this.props.post.author}`;
    return (
      <div className="container_pos-mod"
           ref={ref => this.container = ref}
           style={this.props.style.container}>
        <div className="image-container_pos-mod"
             ref={ref => this.imgCont = ref}
             style={this.props.style.imgCont}>
          <ShowIf show={this.props.post.is_nsfw && !this.props.showAll}>
            <div className="curtain_pos-mod">
              <p className="title_pos-mod">NSFW content</p>
              <p className="message_pos-mod">This content is for adults only. Not
                recommended for children or sensitive individuals.</p>
              <button className="btn btn-index"
                      onClick={
                        () => this.props.setPostModalOptions({showAll: true})
                      }>Show me
              </button>
            </div>
          </ShowIf>
          <ShowIf show={this.props.post.is_low_rated && !this.props.showAll}>
            <div className="curtain_pos-mod">
              <p className="title_pos-mod">Low rated content</p>
              <p className="message_pos-mod">This content is hidden due to low
                ratings.</p>
              <button className="btn btn-index"
                      onClick={
                        () => this.props.setPostModalOptions({showAll: true})
                      }>Show me
              </button>
            </div>
          </ShowIf>
          <button className="btn btn-default btn-xs"
                  onClick={() => this.props.copyToClipboard(
                    document.location.origin + '/post' + this.props.post.url,
                  )}>
            Share post
          </button>
          <img src={this.props.post.body || constants.NO_IMAGE}
               alt="Post picture."
               style={this.props.style.image}
               ref={ref => this.image = ref}
               onLoad={() => this.setComponentSize()}/>

        </div>
        <div className="header_pos-mod"
             ref={ref => this.headerContainer = ref}
             style={this.props.style.headerCont}>
          <div className="date_pos-mod">
            <TimeAgo datetime={this.props.post.created}
                     locale='en_US'
            />
            {
              this.props.showClose != 'yes'
              ?
              <div className="cont-close-btn_pos-mod"
                   onClick={() => this.props.closeModal(this.props.point)}>
                <i className="close-btn_pos-mod"/>
              </div>
              :
              null
            }
          </div>
          <Link to={authorLink} className="user_pos-mod">
            <Avatar src={this.props.post.avatar}/>
            <div className="name_pos-mod">{this.props.post.author}</div>
          </Link>
        </div>

        <div className="description_pos-mod"
             style={this.props.style.description}
             ref={ref => this.descContainer = ref}>
          <div className="control-cont_pos-mod">
            <div className="post-control_pos-mod">
              <div className="likes_pos-mod">
                <LikesComponent likes={this.props.post.net_votes}
                                url={this.props.post.url}/>
              </div>
              <div className="amount_pos-mod">
                <ShowIf show={parseFloat(this.props.post.total_payout_reward)}>
                  ${this.props.post.total_payout_reward}
                </ShowIf>
              </div>
              <div className="button_pos-mod">
                <Flag postIndex={this.props.currentIndex}/>
              </div>
              <div className="button_pos-mod">
                <Vote postIndex={this.props.currentIndex}/>
              </div>
            </div>
          </div>

          <div className="comment-container_pos-mod">
            <ScrollViewComponent
              ref={(ref) => this.scrollView = ref}
              wrapperModifier="list-scroll_pos-mod"
              scrollViewModifier="list-scroll-view_pos-mod"
              autoHeight={window.innerWidth <
              constants.DISPLAY.DESK_BREAKPOINT}
              autoHeightMax={350}
              autoHeightMin={100}
              autoHide={true}
            >
              {this.renderDescription.bind(this)()}
              <Comments
                key="comments"
                item={this.props.post}
                newComment={this.props.newComment}
                replyUser={this.textArea}
              />
            </ScrollViewComponent>
          </div>

          <ShowIf show={this.props.isUserAuth}>
            <div className="add-comment_pos-mod">
              <div className="hidden-div_pos-mod" ref={ref => {this.hiddenDiv = ref}}/>
              <textarea ref={ref => this.textArea = ref}
                        maxLength={2048}
                        className="form-control text-area_pos-mod"
                        onChange={this.changeText.bind(this)}
                        style={{
                          height: this.hiddenDiv !== undefined
                            ? this.props.addCommentHeight + 'px'
                            : START_TEXTAREA_HEIGHT,
                          maxHeight: this.hiddenDiv !== undefined
                            ? this.props.limitTop + 'px'
                            : null
                        }}
              />
              <label className={this.props.label + ' label_pos-mod'}>Comment</label>
              <ShowIf show={this.props.needsCommentFormLoader}>
                <div className="comment-loader_pos-mod">
                  <LoadingSpinner/>
                </div>
              </ShowIf>
              <ShowIf show={!this.props.needsCommentFormLoader}>
                <button type="submit"
                        className={'btn-submit' + ' ' + 'btn_pos-mod' + ' ' + this.props.sendHover}
                        onClick={this.sendComment.bind(this)}
                        ref={ref => {this.sendButton = ref}}>Send
                </button>
              </ShowIf>
            </div>
          </ShowIf>
        </div>
      </div>
    );
  }

  setComponentSize() {
    const DESC_WIDTH = 380;
    const MIN_HEIGHT = 440;
    const PREF_IMG_WIDTH = 640;
    const CONT_MARGIN = 80;
    const MAX_WIDTH_FULL_SCREEN = 815;

    let imgHeight = this.image.naturalHeight;
    let imgWidth = this.image.naturalWidth;
    let docWidth = document.documentElement.clientWidth;
    let docHeight = document.documentElement.clientHeight;
    let contHeight = '100%';
    let contWidth = docWidth;
    let imgContWidth = '100%';

    let headerCont = {
      order: 0,
      backgroundColor: '#FFF',
      width: '100%',
    };
    if (docWidth > MAX_WIDTH_FULL_SCREEN) {
      contHeight = docHeight * 0.9 > MIN_HEIGHT
        ? docHeight * 0.9
        : MIN_HEIGHT;

      imgWidth = imgWidth < PREF_IMG_WIDTH ? imgWidth : PREF_IMG_WIDTH;
      imgWidth = imgWidth < docWidth - DESC_WIDTH - CONT_MARGIN
        ? imgWidth
        : docWidth - DESC_WIDTH - CONT_MARGIN;

      imgHeight = imgHeight * imgWidth / this.image.naturalWidth;

      if (imgHeight > contHeight) {
        imgWidth = imgWidth * contHeight / imgHeight;
        imgHeight = contHeight;
      }

      contWidth = imgWidth + DESC_WIDTH;
      imgContWidth = imgWidth;

      headerCont.order = 2;
      headerCont.width = DESC_WIDTH;
    } else {
      imgWidth = imgWidth < document.documentElement.clientWidth
        ? imgWidth
        : document.documentElement.clientWidth;
      imgHeight = imgHeight * imgWidth / this.image.naturalWidth;
      imgContWidth = '100%';
      headerCont.backgroundColor = '#fafafa';
    }
    let closeButton;
    if (this.props.point !== 'SinglePost') {
      if (this.container.clientWidth + 100 <
        document.documentElement.clientWidth) {
        this.props.setModalOptions(this.props.point, {closeButton: true});
        closeButton = false;
      } else {
        this.props.setModalOptions(this.props.point, {closeButton: false});
        closeButton = true;
      }
    }
    let style = {
      container: {
        width: contWidth,
        height: contHeight,
      },
      image: {
        width: imgWidth,
        height: imgHeight,
      },
      imgCont: {
        width: imgContWidth,
      },
      headerCont,
      description: {
        width: headerCont.width,
      },
    };
    this.props.setPostModalOptions({style, closeButton});
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.postModal,
    post: state.posts[state.postModal.currentIndex],
    isUserAuth: state.auth.user && state.auth.postingKey,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setPostModalOptions: options => {
      dispatch(setPostModalOptions(options));
    },
    setModalOptions: (point, options) => {
      dispatch(setModalOptions(point, options));
    },
    closeModal: (point) => {
      dispatch(closeModal(point));
    },
    sendComment: (index, comment) => {
      dispatch(sendComment(index, comment));
    },
    copyToClipboard: (text) => {
      dispatch(copyToClipboard(text));
    },
    next: (index) => {
      dispatch(nextPostModal(index));
    },
    previous: (index) => {
      dispatch(previousPostModal(index))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
