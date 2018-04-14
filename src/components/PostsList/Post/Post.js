import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Flag from './Flag/Flag';
import ShowIf from '../../Common/ShowIf';
import PostContextMenu from '../../PostContextMenu/PostContextMenu';
import {UserLinkFunc} from '../../Common/UserLinkFunc';
import Constants from '../../../common/constants';
import Tags from './Tags/Tags';
import Vote from './Vote/Vote';
import PostModal from '../../PostModal/PostModal';
import {openPostModal} from '../../../actions/postModal';
import {playVideo, setPowerLikeInd, setPowerLikeTimeout, stopVideo} from '../../../actions/post';
import LoadingSpinner from '../../LoadingSpinner/index';
import Avatar from '../../Common/Avatar/Avatar';
import Likes from './Likes/Likes';
import VoteIndicator from './Vote/VoteIndicator/VoteIndicator';
import jqApp from '../../../libs/app.min';
import './post.css';
import ReactPlayer from 'react-player'

class Post extends React.Component {

  static defaultProps = {
    clearPostHeader: false,
  };

  openPostModal() {
    let modalOption = {
      body: (<PostModal/>)
    };
    this.props.openModal(this.props.point, this.props.index, modalOption);
  }

  commentNumber() {
    if (this.props.children) {
      let text;
      if (this.props.children === 1) {
        text = 'comment';
      } else {
        text = 'comments';
      }
      return (
				<p>{`${this.props.children} ${text}`}</p>
      );
    } else {
      return (
				<p style={{color: '#979b9e'}}>Post your comment</p>
      );
    }
  }

  longTapPLInd(timeDelay) {
    if (this.props.vote) {
      return;
    }
    if (!this.props.authUser) {
      return;
    }
    if (this.props.commentLoader) {
      jqApp.pushMessage.open(Constants.WAIT_FINISHING_TRANSACTION);
      return;
    }
    if (this.props.isPLOpen) {
      return;
    }
    let plTimeout = setTimeout(() => {
      this.props.setPowerLikeInd(this.props.index, true, 'post');
    }, timeDelay);
    this.props.setPowerLikeTimeout(this.props.index, plTimeout);
  }

  breakLongTapPLInd() {
    clearTimeout(this.props.plTimeout);
  }

  renderImage() {
    if (this.props.isVideo) {
      return (
        <div className="card-pic post_vid-con" onClick={this.openPostModal.bind(this)}
             onMouseEnter={() => {
               this.props.playVideo(this.props.index)
             }}
             onMouseLeave={() => {
               this.props.stopVideo(this.props.index);
               this.player.seekTo(0);
             }}
        >
          <ReactPlayer
            url={this.props.imgUrl}
            height='100%'
            loop={true}
            playing={this.props.playing}
            controls={false}
            ref={ref => this.player = ref}
          />

        </div>
      )
    }
    let itemImage = this.props.imgUrl || Constants.NO_IMAGE;
    const cardPhotoStyles = {
      backgroundImage: 'url(' + itemImage + ')',
    };
    return (
      <div className="card-pic" onClick={this.openPostModal.bind(this)}>
        <ShowIf show={this.props.isGallery}>
          <div className="gallery-indicator_post"/>
        </ShowIf>
        <ShowIf show={this.props['is_nsfw']}>
          <div className="forAdult">
            <p>NSFW content</p>
          </div>
        </ShowIf>
        <ShowIf show={!this.props.is_nsfw && this.props.is_low_rated}>
          <div className="forAdult">
            <p>Low rated content</p>
          </div>
        </ShowIf>
        <a style={cardPhotoStyles} className="img" alt="User"> </a>
      </div>
    )
  }

	render() {
		if (!this.props || !this.props.imgUrl) {
			return null;
		}
		let authorImage = this.props.avatar || Constants.NO_AVATAR;

		const authorLink = `/@${this.props.author}`;

		return (
			<div className="item-wrap" id={this.props.index}>
				<div className="post-card position--relative">
					<ShowIf show={this.props.postDeleting}>
						<div className="delete-loader_post"
								 style={{height: this.props.clearPostHeader ? '512px' : '552px'}}
						>
							<LoadingSpinner style={{position: 'absolute'}} loaderClass='deleting-loader'/>
						</div>
					</ShowIf>
					<ShowIf show={!this.props.clearPostHeader}>
						<div className="card-head clearfix">
							<div className="date">
								<TimeAgo
									datetime={this.props.created}
									locale='en_US'
									style={{float: 'left'}}
								/>
								<PostContextMenu style={{float: 'right', height: '22px', width: '22px', marginLeft: '10px'}}
																 className="post-context-menu_post"
																 item={this.props}
																 index={this.props.index}
								/>
							</div>
							<Link to={authorLink} className="user">
								<div className="photo">
									<Avatar src={authorImage}/>
								</div>
								<div className="name">{this.props.author}</div>
							</Link>
						</div>
					</ShowIf>
					<div className="card-body">
            {this.renderImage()}
						<div className="card-wrap">
							<div className="card-controls">
								<ShowIf show={this.props.isPLOpen && this.props.powerLikeIndPlace === 'post'}>
									<VoteIndicator index={this.props.index}
																 voteButton={this.vote}
																 isPopup={false}
									/>
								</ShowIf>
								<Likes postIndex={this.props.index}/>
								<div className="card-buttons_post">
									<ShowIf show={parseFloat(this.props.total_payout_reward)}>
										<div className="amount">${this.props.total_payout_reward}</div>
									</ShowIf>
									<ShowIf show={this.props.authUser !== this.props.author}>
										<Flag postIndex={this.props.index} commentLoader={this.props.commentLoader}/>
									</ShowIf>
									<div className="position--relative"
											 ref={ref => this.vote = ref}
											 onMouseEnter={this.longTapPLInd.bind(this, 1400)}
											 onMouseLeave={this.breakLongTapPLInd.bind(this)}
											 onTouchStart={this.longTapPLInd.bind(this, 700)}
											 onTouchEnd={this.breakLongTapPLInd.bind(this)}
											 onTouchMove={this.breakLongTapPLInd.bind(this)}
											 onContextMenu={this.breakLongTapPLInd.bind(this)}
									>
										<div className="card-control-stop"/>
										<Vote postIndex={this.props.index} commentLoader={this.props.commentLoader}/>
									</div>
								</div>
							</div>
							<div className="card-preview">
                {UserLinkFunc(null, this.props.title)}
								<Tags tags={this.props.tags}/>
							</div>
							<div className="number-of-comments_post" onClick={this.openPostModal.bind(this)}>
                {this.commentNumber()}
							</div>
						</div>
					</div>
				</div>
			</div>
    );
  }
}

const mapStateToProps = (state, props) => {
  let post = state.posts[props.index];
  if (post) {
    const media = post.media[0];
   	let isGallery = false;
  	if (post.media.length > 1) {
      isGallery = true;
		}
    let imgUrl = media['thumbnails'] ? media['thumbnails'][1024] : media.url;
    return {
      ...post,
      imgUrl,
      isGallery,
      authUser: state.auth.user,
      commentLoader: state.postModal.needsCommentFormLoader
    };
  }
};

const mapDispatchToProps = (dispatch) => {
	return {
		openModal: (point, index, options) => {
			dispatch(openPostModal(point, index, options));
		},
		setPowerLikeInd: (index, isOpen, place) => {
			dispatch(setPowerLikeInd(index, isOpen, place));
		},
		setPowerLikeTimeout: (index, plTimeout) => {
			dispatch(setPowerLikeTimeout(index, plTimeout));
		},
		playVideo: (index) => {
			dispatch(playVideo(index))
		},
		stopVideo: (index) => {
			dispatch(stopVideo(index))
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);