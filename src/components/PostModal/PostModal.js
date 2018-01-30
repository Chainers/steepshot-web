import React from 'react';
import {connect} from 'react-redux';
import {nextPostModal, previousPostModal, setPostModalOptions,} from '../../actions/postModal';
import constants from '../../common/constants';
import TimeAgo from 'timeago-react';
import {Link} from 'react-router-dom';
import Avatar from '../Common/Avatar/Avatar';
import {closeModal, setModalOptions} from '../../actions/modal';
import ShowIf from '../Common/ShowIf';
import Flag from '../PostsList/Post/Flag/Flag';
import Vote from '../PostsList/Post/Vote/Vote';
import LikesComponent from '../Posts/LikesComponent';
import {UserLinkFunc} from '../Common/UserLinkFunc';
import Tags from '../PostsList/Post/Tags/Tags';
import ScrollViewComponent from '../Common/ScrollViewComponent';
import Comments from '../Posts/Comments';
import LoadingSpinner from '../LoadingSpinner/index';
import {sendComment} from '../../actions/comment';
import {copyToClipboard} from '../../actions/clipboard';
import ReactDOM from 'react-dom';
import PostContextMenu from '../../PostContextMenu/PostContextMenu';

const START_TEXTAREA_HEIGHT = '42px';

class PostModal extends React.Component {

  static defaultProps = {
    showClose: true,
  };

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
            this.clearTextArea();
            break;
          case 39:
            this.props.next(this.props.currentIndex);
            this.clearTextArea();
            break;
          default :
            break;
        }
      }
    };
  }

  clearTextArea() {
    this.textArea.value = '';
    this.hiddenDiv.textContent = '';
    this.setComponentSize();
  }

  renderImage() {
    return (
      <div className="image-container_pos-mod"
           style={this.props.style.imgCont}>
        <ShowIf show={this.props.post.is_nsfw && !this.props.showAll}>
          <div className="curtain_pos-mod">
            <p className="title_pos-mod">NSFW content</p>
            <p className="message_pos-mod">This content is for adults only.
              Not
              recommended for children or sensitive individuals.</p>
            <button className="btn btn-index"
                    onClick={
                      () => this.props.setPostModalOptions({showAll: true})
                    }>Show me
            </button>
          </div>
        </ShowIf>
        <ShowIf show={this.props.post.is_low_rated && !this.props.showAll && !this.props.post.is_nsfw}>
          <div className="curtain_pos-mod">
            <p className="title_pos-mod">Low rated content</p>
            <p className="message_pos-mod">This content is hidden due to low ratings.</p>
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
             onLoad={this.imageLoaded.bind(this)}
             onError={this.loadImgError.bind(this)}/>
        <ShowIf show={!this.image || !this.image.complete}>
          <div className="before-load-curtain_pos-mod">
            <LoadingSpinner/>
          </div>
        </ShowIf>
        <ShowIf show={this.image && this.image.complete && !this.image.naturalWidth}>
          <div className="before-load-curtain_pos-mod">
            <p className="title_pos-mod">Not found.</p>
          </div>
        </ShowIf>
      </div>);
  }

  renderDescription() {
    let forceOpen = false;
    let descriptionStart = this.props.post.description.replace(/(<\w+>)+/, '');
    if (descriptionStart.replace(/\n[\w\W]+/, '').length < 140) {
      forceOpen = true;
    }

    return (
      <div className="text-description_pos-menu">
        <p>{UserLinkFunc(true, this.props.post.title)}</p>
        <div
          className={(this.props.isDescriptionOpened || forceOpen)
            ? 'collapse-opened'
            : 'collapse-closed'}
        >

          {UserLinkFunc(false, this.props.post.description)}
          <Tags tags={this.props.post.tags}/>
          <a className="lnk-more" onClick={this.openDescription.bind(this)}>Show
            more</a>
        </div>
      </div>);
  }

  imageLoaded() {
    this.setComponentSize();
  }

  loadImgError() {
    this.setComponentSize();
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
    this.changeText();
  }

  render() {
    const authorLink = `/@${this.props.post.author}`;
    return (
      <div className="container_pos-mod"
           style={this.props.style.container}>
        {this.renderImage.bind(this)()}
        <div className="header_pos-mod"
             style={this.props.style.headerCont}>
          <div className="date_pos-mod">
            <TimeAgo datetime={this.props.post.created}
                     locale='en_US'
            />
            <PostContextMenu style={{height: '22px', width: '22px', marginLeft: '5px'}}
                             className="post-context-menu_post"
                             item={this.props.post}
                             index={this.props.currentIndex}
            />
            <ShowIf show={this.props.showClose}>
              <div className="cont-close-btn_pos-mod" onClick={() => this.props.closeModal(this.props.point)}>
                <i className="close-btn_pos-mod"/>
              </div>
            </ShowIf>
          </div>
          <Link to={authorLink} className="user_pos-mod">
            <Avatar src={this.props.post.avatar}/>
            <div className="name_pos-mod">{this.props.post.author}</div>
          </Link>
        </div>

        <div className="description_pos-mod"
             style={this.props.style.description}
        >
          <div className="control-cont_pos-mod">
            <div className="post-control_pos-mod">
              <div className="likes_pos-mod">
                <LikesComponent likes={this.props.post.net_votes}
                                url={this.props.post.url}/>
              </div>
              <div className="amount_pos-mod">
                <ShowIf show={parseFloat(this.props.post.total_payout_reward)}>
                  <div>
                    ${this.props.post.total_payout_reward}
                  </div>
                </ShowIf>
              </div>
              <ShowIf show={this.props.authUser != this.props.post.author}>
                <div className="button_pos-mod">
                  <Flag postIndex={this.props.currentIndex}/>
                </div>
              </ShowIf>
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
              <div className="hidden-div_pos-mod"
                   ref={ref => {
                     this.hiddenDiv = ref;
                   }}/>
              <textarea ref={ref => this.textArea = ref}
                        maxLength={2048}
                        className="form-control text-area_pos-mod"
                        onChange={this.changeText.bind(this)}
                        style={{
                          height: this.hiddenDiv !== undefined
                            ? this.props.addCommentHeight + 'px'
                            : START_TEXTAREA_HEIGHT,
                        }}
              />
              <label
                className={this.props.label + ' label_pos-mod'}>Comment</label>
              <ShowIf show={this.props.needsCommentFormLoader}>
                  <LoadingSpinner styles={'0'}/>
              </ShowIf>
              <ShowIf show={!this.props.needsCommentFormLoader}>
                <button type="submit"
                        className={'btn-submit' + ' ' + 'btn_pos-mod' + ' ' + this.props.sendHover}
                        onClick={this.sendComment.bind(this)}
                >Send</button>
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
      imgWidth = imgWidth ? imgWidth : this.image.clientWidth;

      imgHeight = imgHeight * imgWidth / this.image.naturalWidth;

      if (imgHeight > contHeight) {
        imgWidth = imgWidth * contHeight / imgHeight;
        imgHeight = contHeight;
      }
      contHeight = imgHeight;
      if (contHeight < MIN_HEIGHT) {
        contHeight = MIN_HEIGHT;
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
        order: 1,
      },
      headerCont,
      description: {
        width: headerCont.width,
      },
    };
    this.props.setPostModalOptions({style});
    if (this.props.point !== 'SinglePost') {
      if (contHeight >=
        document.documentElement.clientHeight || contHeight === '100%') {
        this.props.setModalOptions(this.props.point,
          {alignItems: 'flex-start'});
      } else {
        this.props.setModalOptions(this.props.point, {alignItems: 'center'});
      }
    }
  }
}

const mapStateToProps = (state) => {
  return {
    postList: state.postsList[state.postModal.point],
    ...state.postModal,
    post: state.posts[state.postModal.currentIndex],
    isUserAuth: state.auth.user && state.auth.postingKey,
    authUser: state.auth.user
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
      dispatch(previousPostModal(index));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
