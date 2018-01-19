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
import {setDefaultAvatar} from '../../../actions/post';

class Post extends React.Component {
  
  static defaultProps = {
    clearPostHeader: false,
  };
  
  constructor(props) {
    super(props);
    this.localConstants = {
      THIS_POST_MODAL_REF: 'thisPostModal' + this.props.index,
    };
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
  
  
  
  render() {
    if (!this.props) {
      return null;
    }
    let itemImage = this.props.body || constants.NO_IMAGE;
    let authorImage = this.props.avatar || constants.NO_AVATAR;
    
    const authorLink = `/@${this.props.author}`;
    const cardPhotoStyles = {
      backgroundImage: 'url(' + itemImage + ')',
    };
    
    return (
      <div className="post-card" style={{width: 300}}>
        <ShowIf show={!this.props.clearPostHeader}>
          <div className="card-head clearfix">
            <div className="date">
              <PostContextMenu style={{float: 'left', height: '22px'}}
                               item={this.props}
                               index={this.props.index}/>
              <TimeAgo
                datetime={this.props.created}
                locale='en_US'
                style={{float: 'right'}}
              />
            </div>
            <Link to={authorLink} className="user">
              <div className="photo">
                <img src={authorImage} alt="User"
                     onError={
                       () => this.props.setDefaultAvatar(this.props.index)}/>
              </div>
              <div className="name">{this.props.author}</div>
            </Link>
          </div>
        </ShowIf>
        <div className="card-body">
          <div className="card-pic"
               onClick={this.props.openModal}>
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
    setDefaultAvatar: (postIndex => {
      dispatch(setDefaultAvatar(postIndex));
    })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Post);
