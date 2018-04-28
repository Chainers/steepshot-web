import React from 'react';
import {connect} from 'react-redux';
import {
	nextPostModal, setPostOffset, previousPostModal, setFSNavigation, setFullScreen,
	setPostModalOptions
} from '../../actions/postModal';
import Constants from '../../common/constants';
import TimeAgo from 'timeago-react';
import {Link} from 'react-router-dom';
import Avatar from '../Common/Avatar/Avatar';
import {closeModal} from '../../actions/modal';
import ShowIf from '../Common/ShowIf';
import Flag from '../PostsList/Post/Flag/Flag';
import Vote from '../PostsList/Post/Vote/Vote';
import LoadingSpinner from '../LoadingSpinner/index';
import {copyToClipboard} from '../../actions/clipboard';
import ReactDOM from 'react-dom';
import PostContextMenu from '../PostContextMenu/PostContextMenu';
import Likes from '../PostsList/Post/Likes/Likes';
import FullScreenButtons from './FullScreenButtons/FullScreenButtons';
import {toggleVote} from '../../actions/vote';
import {setPowerLikeInd, setPowerLikeTimeout} from '../../actions/post';
import {openPushNot} from "../../actions/pushNotification";
import ImagesGallery from "../ImagesGallery/ImagesGallery";
import ReactPlayer from 'react-player'
import Comments from "../Comments/Comments";
import './postModal.css';
import {utils} from "../../utils/utils";

const HEADER_HEIGHT = 60;

class PostModal extends React.Component {

	static defaultProps = {
		showClose: true,
	};

	constructor() {
		super();
		this.setComponentSize = this.setComponentSize.bind(this);
		this.showFSNavigation = this.showFSNavigation.bind(this);
		this.fsCheckButtons = this.fsCheckButtons.bind(this);
		this.initKeyPress = this.initKeyPress.bind(this);
	}

	componentDidMount() {
		window.addEventListener('keydown', this.initKeyPress);
		this.setComponentSize();
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.initKeyPress);
	}

	componentWillReceiveProps(nextProps) {
		let post = document.getElementById(this.props.currentIndex);
		if (post && (post.offsetTop !== 0) && ((post.offsetTop - HEADER_HEIGHT) !== nextProps.offsetTop)) {
			this.props.setPostOffset(post.offsetTop - HEADER_HEIGHT);
		}
		if (!utils.equalsObjects(nextProps.window, this.props.window)) {
			this.setComponentSize();
		}
	}

  checkFSFirstLast(isClick) {
    if (isClick || (!isClick && !this.props.timeoutID)) {
      setTimeout(() => {
        if (this.props.firstPost) {
          this.fsNavMouseLeave();
        }
      }, 100);
    }
  }

	previousPost(isClick) {
		this.checkFSFirstLast(isClick);
		if (!this.props.firstPost) {
			this.props.previous(this.props.currentIndex);
		}
	}

	nextPost(isClick) {
    this.checkFSFirstLast(isClick);
    if (this.props.fullScreenMode && this.props.newPostsLoading) {
    	return;
		}
		if (!this.props.lastPost) {
			this.props.next(this.props.currentIndex);
		}
	}

	initKeyPress(e) {
		if ((document.activeElement !== ReactDOM.findDOMNode(this.textArea)) && !this.props.focusedTextInput) {
			switch (e.keyCode) {
				case 37:
					this.previousPost();
					break;
				case 39:
					this.nextPost();
					break;
				case 27:
					if (this.props.fullScreenMode) {
						this.setFullScreen(false);
					} else {
						this.props.closeModal(this.props.point);
					}
					break;
				case 13:
					this.props.toggleVote(this.props.currentIndex);
					break;
				default:
					break;
			}
		}
	}

	lowNSFWFilter() {
		return (
			<div>
				<ShowIf show={this.props.post['is_nsfw'] && !this.props.showAll}>
					<div className="curtain_pos-mod">
						<p className="title_pos-mod">NSFW content</p>
						<p className="message_pos-mod">This content is for adults only. Not recommended for children or sensitive
							individuals.</p>
						<button className="btn btn-index"
										onClick={() => this.props.setPostModalOptions({showAll: true})}
						>Show me
						</button>
					</div>
				</ShowIf>
				<ShowIf show={this.props.post['is_low_rated'] && !this.props.showAll && !this.props.post['is_nsfw']}>
					<div className="curtain_pos-mod">
						<p className="title_pos-mod">Low rated content</p>
						<p className="message_pos-mod">This content is hidden due to low ratings.</p>
						<button className="btn btn-index"
										onClick={() => this.props.setPostModalOptions({showAll: true})}
						>Show me
						</button>
					</div>
				</ShowIf>
			</div>
		)
	}

	resizingFilter() {
		return (
			<ShowIf show={this.props.isResizeCover && this.props.isGallery}>
				<div className="resizing-filter_pos-mod">
					<p>Resizing...</p>
				</div>
			</ShowIf>
		)
	}

	copyLinkToClipboard(e) {
    e.target.blur();
    this.props.copyToClipboard(
      document.location.origin + '/post' + this.props.post.url.replace(/\/[\w-.]+/, '')
    );
	}

	renderImage() {
		return (
			<div className="image-container_pos-mod" style={this.props.style.imgCont}>
				{this.lowNSFWFilter()}
				{this.resizingFilter()}
				<span className="open-fs-dblclick_pos-mod"
							onDoubleClick={this.setFullScreen.bind(this, !this.props.fullScreenMode)}/>
				<button className="btn btn-default btn-xs"
								onClick={(e) => this.copyLinkToClipboard(e)}>Copy link
				</button>
				<ShowIf show={!this.props.style.isFullScreen && !this.props.fullScreenMode && !this.props.singlePost}>
					<div className="full-screen-button_pos-mod"
							 onClick={this.setFullScreen.bind(this, true)}
					>
						<img className="img-full-screen" src="/images/shape.svg" alt="open full screen"/>
					</div>
				</ShowIf>
				<ShowIf show={!this.props.post.isVideo}>
					<ImagesGallery index={this.props.currentIndex}
												 styles={this.props.style.image}
												 post={this.props.post}
												 isFullScreen={false}
												 setComponentSize={this.setComponentSize}/>
				</ShowIf>
				<ShowIf show={this.props.post.isVideo}>
					<div className="image-container_pos-mod image-container_vid-con"
							 style={this.props.style.imgCont}
					>
						<ReactPlayer
							width='100%'
							height='100%'
							url={this.props.urlVideo}
							playing={true}
							loop={true}/>
					</div>
				</ShowIf>
			</div>
		)
	}

	renderFullScreenImg() {
		return (
			<div>
				<div className="full-image-wrap_pos-mod">
					{this.lowNSFWFilter()}
					{this.resizingFilter()}
					<span className="open-fs-dblclick_pos-mod"
								onDoubleClick={this.setFullScreen.bind(this, !this.props.fullScreenMode)}/>
					<button className="btn btn-default btn-xs full-screen-share_pos-mod"
									onClick={(e) => this.copyLinkToClipboard(e)}>Copy link
					</button>
					<ShowIf show={!this.props.post.isVideo}>
						<ImagesGallery index={this.props.currentIndex}
													 styles={{maxHeight: '90vh', maxWidth: '85vw'}}
													 post={this.props.post}
													 isFullScreen={true}
													 setComponentSize={this.setComponentSize}/>
					</ShowIf>
					<ShowIf show={this.props.post.isVideo}>
						<div className="video-con-fs_pos-mod">
							<ReactPlayer
								height='100%'
								url={this.props.urlVideo}
								playing={true}
								loop={true}/>
						</div>
					</ShowIf>
				</div>
				<ShowIf show={this.props.fullScreenNavigation}>
					<div>
						<ShowIf show={!this.props.firstPost}>
							<div className="arrow-left-full-screen_post-mod"
									 onClick={this.previousPost.bind(this, true)}
									 onMouseEnter={this.fsNavMouseEnter.bind(this)}
									 onMouseLeave={this.fsNavMouseLeave.bind(this)}
							/>
						</ShowIf>
						<ShowIf show={!this.props.lastPost && !this.props.newPostsLoading}>
							<div className="arrow-right-full-screen_post-mod"
									 onClick={this.nextPost.bind(this, true)}
									 onMouseEnter={this.fsNavMouseEnter.bind(this)}
									 onMouseLeave={this.fsNavMouseLeave.bind(this)}
							/>
						</ShowIf>
						<ShowIf show={this.props.newPostsLoading}>
							<div className="loader-right-full-screen_post-mod"
									 onMouseEnter={this.fsNavMouseEnter.bind(this)}
									 onMouseLeave={this.fsNavMouseLeave.bind(this)}
							>
								<LoadingSpinner style={{
									position: 'absolute', top: '50%', left: '24%',
									transform: 'translate(-50%, -50%)', height: 38
								}} loaderClass="new-posts-spinner_post-mod"
								/>
							</div>
						</ShowIf>
					</div>
					<div className="close-full-screen_pos-mod"
							 onClick={this.setFullScreen.bind(this, false)}
							 onMouseEnter={this.fsNavMouseEnter.bind(this)}
							 onMouseLeave={this.fsNavMouseLeave.bind(this)}
					>
						<img className="img-full-screen" src="/images/shape-copy-6.svg" alt="close full screen"/>
					</div>
					<div className="cross-wrapper_modal"
							 onClick={this.closeFromFullScreen.bind(this, false)}
							 onMouseEnter={this.fsNavMouseEnter.bind(this)}
							 onMouseLeave={this.fsNavMouseLeave.bind(this)}
					>
						<div className="cross-full-screen_modal"/>
					</div>
					<div className="fs-post-amount_pos-mod">
						<ShowIf show={parseFloat(this.props.post.total_payout_reward)}>
							${this.props.post.total_payout_reward}
						</ShowIf>
					</div>
					<FullScreenButtons/>
				</ShowIf>
			</div>
		)
	}

	showFSNavigation() {
		clearTimeout(this.props.timeoutID);
		let timeoutID = setTimeout(() => {
			this.props.setFSNavigation(false, null);
		}, 6000);
		this.props.setFSNavigation(true, timeoutID);
	}

	fsRightLeft(isOpen) {
		if (isOpen) {
			window.addEventListener('keydown', this.fsCheckButtons);
		} else {
			window.removeEventListener('keydown', this.fsCheckButtons);
		}
	}

	fsCheckButtons(e) {
		if (e.keyCode !== 37 && e.keyCode !== 39 && e.keyCode !== 13) this.showFSNavigation();
	}

	closeFromFullScreen(isOpen) {
		this.setFullScreen(isOpen);
		this.props.closeModal(this.props.point);
	}

	setFullScreen(isOpen) {
		if (this.props.singlePost || this.props.style.isFullScreen) {
			return;
		}
		let timeoutID = null;
		if (isOpen) {
			window.addEventListener('mousemove', this.showFSNavigation);
			this.fsRightLeft(isOpen);
			timeoutID = setTimeout(() => {
				this.props.setFSNavigation(false, null);
			}, 6000);
		}
		if (!isOpen) {
			window.removeEventListener('mousemove', this.showFSNavigation);
			this.fsRightLeft(isOpen);
			clearTimeout(this.props.timeoutID);
			this.props.setFSNavigation(true, null);
		}
		this.props.setFullScreen(isOpen, timeoutID);
	}

	fsNavMouseEnter() {
		clearTimeout(this.props.timeoutID);
		window.removeEventListener('mousemove', this.showFSNavigation);
		this.fsRightLeft();
		this.props.setFSNavigation(true, null);
	}

	fsNavMouseLeave() {
		window.addEventListener('mousemove', this.showFSNavigation);
		this.fsRightLeft(true);
	}

	longTapPLInd(timeDelay) {
		if (this.props.post.vote) {
			return;
		}
		if (!this.props.authUser) {
			return;
		}
		if (this.props.post.isPLOpen) {
			return;
		}
		let plTimeout = setTimeout(() => {
			this.props.setPowerLikeInd(this.props.currentIndex, true, 'modal');
		}, timeDelay);
		this.props.setPowerLikeTimeout(this.props.currentIndex, plTimeout);
	}

	breakLongTapPLInd() {
		clearTimeout(this.props.post.plTimeout);
	}

	render() {
		const authorLink = `/@${this.props.post.author}`;

		let hideModalFS = this.props.style.container;
		if (this.props.fullScreenMode) {
			hideModalFS = {
				position: 'absolute',
				top: '-5000px',
				visibility: 'hidden'
			}
		}
		return (
			<div>
				<div className="container_pos-mod" style={hideModalFS}>
					<ShowIf show={this.props.showClose && !this.props.style.isMobile}>
						<ShowIf show={!this.props.firstPost}>
							<div className="arrow-left-full-screen_post-mod" onClick={this.previousPost.bind(this)}/>
						</ShowIf>
						<ShowIf show={!this.props.lastPost && !this.props.newPostsLoading}>
							<div className="arrow-right-full-screen_post-mod" onClick={this.nextPost.bind(this)}/>
						</ShowIf>
						<ShowIf show={this.props.newPostsLoading}>
							<div className="loader-right-full-screen_post-mod" onClick={this.nextPost.bind(this)}>
								<LoadingSpinner style={{
									position: 'absolute', top: '50%', left: '50%',
									transform: 'translate(-50%, -53%)', width: 35, height: 35
								}} loaderClass="new-posts-spinner_post-mod"
								/>
							</div>
						</ShowIf>
					</ShowIf>
					{this.renderImage()}
					<div className="header_pos-mod"
							 style={this.props.style.headerCont}
					>
						<div className="date_pos-mod">
							<TimeAgo datetime={this.props.post.created}
											 locale='en_US'
											 className="time_pos-mod"
							/>
							<PostContextMenu style={{height: '22px', width: '22px', marginRight: this.props.showClose ? '38px' : 0}}
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
							<div className="name_pos-mod">
								{this.props.post.author}
							</div>
						</Link>
					</div>
					<div className="description_pos-mod"
							 style={this.props.style.description}
							 ref={ref => this.descPosMod = ref}
					>
						<div className="card-controls_post card-controls-border_post">
							<Likes postIndex={this.props.currentIndex} style={{paddingLeft: 20}}/>
							<div className="card-buttons_post">
								<ShowIf show={parseFloat(this.props.post.total_payout_reward)}>
									<div className="amount">${this.props.post.total_payout_reward}</div>
								</ShowIf>
								<ShowIf show={this.props.authUser !== this.props.post.author}>
									<Flag postIndex={this.props.currentIndex}/>
								</ShowIf>
								<div className="position--relative">
									<div className="card-control-stop"/>
									<Vote postIndex={this.props.currentIndex}
												powerLikeIndPlace="modal"
												isPopup={true}
												style={{paddingRight: 20}}
                        width={this.props.documentWidth < 350 ? {
                            maxWidth: this.props.documentWidth, left: -(this.props.documentWidth - 58)} : null}
									/>
								</div>
							</div>
						</div>

						<Comments point={this.props.currentIndex}/>
					</div>
				</div>
				<ShowIf show={this.props.fullScreenMode}>
					{this.renderFullScreenImg()}
				</ShowIf>
			</div>
		);
	}

	setComponentSize() {
		const DESC_WIDTH = 380;
		const MIN_HEIGHT = 440;
		const MAX_WIDTH_FULL_SCREEN = 815;

		let sideMargin = 0.75;

		const docWidth = this.props.window.width;
		if (docWidth < 1080) {
			sideMargin = 0.6;
		}
		const docHeight = this.props.window.height;
		const MAX_IMG_WIDTH = (docWidth - DESC_WIDTH) * sideMargin;
		const PREFERRED_IMG_WIDTH = 640;
		const isMobile = docWidth < MAX_WIDTH_FULL_SCREEN;
		const isFullScreen = docWidth < 1025;

		const container = {};
		container.width = docWidth;
		container.height = '100%';

		const textareaMarginTop = this.descPosMod ? this.descPosMod.clientHeight - 220 : null;

		const image = {};
		const imageSizes = this.props.post.media[0].size;

		image.width = imageSizes.width;
		image.height = imageSizes.height;

		const imgCont = {};
		imgCont.width = '100%';
		const headerCont = {};
		if (isMobile) {
			headerCont.width = '100%';
		}

		const description = {};
		description.width = headerCont.width;
		if (docWidth > MAX_WIDTH_FULL_SCREEN) {
			image.width = image.width ? image.width : Math.min((docWidth - DESC_WIDTH) * sideMargin, PREFERRED_IMG_WIDTH);
			container.height = Math.max(docHeight * 0.9, MIN_HEIGHT);

			if (image.height > container.height) {
				image.width = image.width * container.height / image.height;
				image.height = container.height;
			}

			if (image.width > MAX_IMG_WIDTH) {
				image.height = image.height * MAX_IMG_WIDTH / image.width;
				image.width = MAX_IMG_WIDTH;
			}

			container.width = image.width + DESC_WIDTH;
			imgCont.width = image.width;
			headerCont.width = DESC_WIDTH;

			container.height = Math.max(image.height, MIN_HEIGHT);
		} else {
			image.width = Math.min(image.width, docWidth);
			image.width = image.width ? image.width : docWidth;
			image.height = image.height * image.width / imageSizes.width;
		}
		let style = {
			container,
			image,
			imgCont,
			headerCont,
			description,
			textareaMarginTop,
			isMobile,
			isFullScreen
		};
		if (JSON.stringify(style) !== JSON.stringify(this.props.style)) {
			this.props.setPostModalOptions({style});
		}
		if (isFullScreen && this.props.fullScreenMode) {
			this.props.setFullScreen(false);
		}
	}
}

const mapStateToProps = (state) => {
	let documentWidth = document.documentElement.clientWidth;
	let currentIndex = state.postModal.currentIndex;
	let post = state.posts[currentIndex];
	if (post) {
		let urlVideo = post.media[0].url;
		let isGallery = false;
		if (post.media.length > 1) {
			isGallery = true;
		}
		let postsList = state.postsList[state.postModal.point];
		return {
			post,
			postsList,
			urlVideo,
			documentWidth,
			...state.postModal,
			isGallery: isGallery,
			newPostsLoading: postsList.loading,
			isUserAuth: state.auth.user && state.auth.postingKey,
			authUser: state.auth.user,
			isResizeCover: state.imagesGallery.isResizeCover,
			firstPost: postsList.posts[0] === currentIndex,
			lastPost: postsList.offset === currentIndex,
			focusedTextInput: state.textInput[Constants.TEXT_INPUT_POINT.COMMENT] ?
				state.textInput[Constants.TEXT_INPUT_POINT.COMMENT].focused : false,
			window: state.window,
			offsetTop: state.postModal.postOffset
		};
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		setPostModalOptions: options => {
			dispatch(setPostModalOptions(options));
		},
		closeModal: (point) => {
			dispatch(closeModal(point));
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
		toggleVote: (postIndex) => {
			dispatch(toggleVote(postIndex));
		},
		setFullScreen: (isOpen, timeoutID) => {
			dispatch(setFullScreen(isOpen, timeoutID));
		},
		setFSNavigation: (isVisible, timeoutID) => {
			dispatch(setFSNavigation(isVisible, timeoutID));
		},
		setPostOffset: (offset) => {
			dispatch(setPostOffset(offset));
		},
		setPowerLikeInd: (index, isOpen, place) => {
			dispatch(setPowerLikeInd(index, isOpen, place));
		},
		setPowerLikeTimeout: (index, plTimeout) => {
			dispatch(setPowerLikeTimeout(index, plTimeout));
		},
		openPushNot: (index, pushNotBody) => {
			dispatch(openPushNot(index, pushNotBody));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
