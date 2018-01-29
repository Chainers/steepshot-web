import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Flag from './Flag/Flag';
import ShowIf from '../../Common/ShowIf';
import PostContextMenu from '../../PostContextMenu/PostContextMenu';
import LikesComponent from '../../Posts/LikesComponent';
import {UserLinkFunc} from '../../Common/UserLinkFunc';
import constants from '../../../common/constants';
import Tags from './Tags/Tags';
import Vote from './Vote/Vote';
import PostModal from '../PostModal/PostModal';
import {openPostModal} from '../../../actions/postModal';
import LoadingSpinner from "../../LoadingSpinner/index";
import Avatar from '../../Common/Avatar/Avatar';

class Post extends React.Component {

  static defaultProps = {
    clearPostHeader: false,
  };

  constructor(props) {
    super(props);
  }

  callPreventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  _getPostImageStyles(itemImage) {
    return {
      backgroundImage: `url(${itemImage})`,
      backgroundPosition: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundOrigin: 'center',
      backgroundClip: 'content-box',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
  }

  openPostModal() {
    let modalOption = {
      body: (<PostModal />),
    };
    this.props.openModal(this.props.point, this.props.index, modalOption);
  }

  render() {
    console.log(this.props);
    if (!this.props || !this.props.body) {
      return null;
    }
    let itemImage = this.props.body || constants.NO_IMAGE;
    let authorImage = this.props.avatar || constants.NO_AVATAR;

    const authorLink = `/@${this.props.author}`;
    const cardPhotoStyles = {
      backgroundImage: 'url(' + itemImage + ')',
    };
    return (
      <div className="post-card" style={{width: '300px', position: 'relative'}}>
        <ShowIf show={this.props.postDeleting}>
          <div className="delete-loader_post">
            <LoadingSpinner show={true} deleting={true}/>
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
          <div className="card-pic"
               onClick={this.openPostModal.bind(this)}>
            <ShowIf show={this.props.is_nsfw}>
              <div className="forAdult">
                <p>NSFW content</p>
              </div>
            </ShowIf>
            <ShowIf show={!this.props.is_nsfw && this.props.is_low_rated}>
              <div className="forAdult">
                <p>Low rated content</p>
              </div>
            </ShowIf>
            <a style={cardPhotoStyles} className="img" alt="User"/>
          </div>
          <div className="card-wrap">
            <div className="card-controls clearfix">
              <div className="buttons-row">
                <Vote postIndex={this.props.index}/>
                <Flag postIndex={this.props.index}/>
              </div>
              <div className="wrap-counts clearfix">
                <LikesComponent likes={this.props.net_likes} url={this.props.url}/>
                <ShowIf show={parseFloat(this.props.total_payout_reward).toFixed(2) != 0}>
                  <div className="amount">${this.props.total_payout_reward}</div>
                </ShowIf>
              </div>
            </div>
            <div className="card-preview">
              {UserLinkFunc(null, this.props.title)}
              <Tags tags={this.props.tags}/>
            </div>
            <div className="number-of-comments_post">
               <p>There are no comments yet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.posts[props.index],
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    openModal: (point, index, options) => {
      dispatch(openPostModal(point, index, options));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
