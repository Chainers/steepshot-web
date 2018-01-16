import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import TimeAgo from 'timeago-react';
import Flag from './Flag/Flag';
import ShowIf from '../../Common/ShowIf';
import PostContextMenu from '../../PostContextMenu/PostContextMenu';
import VouteComponent from '../../Posts/VouteComponent';
import LikesComponent from '../../Posts/LikesComponent';
import {UserLinkFunc} from '../../Common/UserLinkFunc';
import constants from '../../../common/constants';
import Tags from './Tags/Tags';

class Post extends React.Component {
  
  static defaultProps = {
    clearPostHeader: false,
  };
  
  constructor(props) {
    super(props);
    this.localConstants = {
      THIS_POST_MODAL_REF: 'thisPostModal' + this.props.index,
    };
    this.getComponentState = this.getComponentState.bind(this);
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
  
  _openModal() {
    let state = this.getComponentState();
    if (state.openModal != undefined) {
      state.openModal(this.props.index);
    }
  }
  
  render() {
    let state = this.getComponentState();
    if (!state) {
      return null;
    }
    let itemImage = state.body || constants.NO_IMAGE;
    let authorImage = state.avatar || constants.NO_AVATAR;
    
    const authorLink = `/@${state.author}`;
    const cardPhotoStyles = {
      backgroundImage: 'url(' + itemImage + ')',
    };
    
    return (
      <div className="post-card">
        <ShowIf show={!this.props.clearPostHeader}>
          <div className="card-head clearfix">
            <div className="date">
              <PostContextMenu style={{float: 'left', height: '22px'}}
                               item={state}
                               index={this.props.index}/>
              <TimeAgo
                datetime={state.created}
                locale='en_US'
                style={{float: 'right'}}
              />
            </div>
            <Link to={authorLink} className="user">
              <div className="photo">
                <img src={authorImage} alt="User"/>
              </div>
              <div className="name">{state.author}</div>
            </Link>
          </div>
        </ShowIf>
        <div className="card-body">
          <div className="card-pic" onClick={this._openModal.bind(this)}>
            <ShowIf show={state.is_nsfw}>
              <div className="forAdult">
                <p>NSFW content</p>
              </div>
            </ShowIf>
            <ShowIf show={!state.is_nsfw && state.is_low_rated}>
              <div className="forAdult">
                <p>Low rated content</p>
              </div>
            </ShowIf>
            <a style={cardPhotoStyles} className="img" alt="User"/>
          </div>
          <div className="card-wrap">
            <div className="card-controls clearfix">
              <div className="buttons-row"
                   onClick={(e) => {this.callPreventDefault(e);}}>
                <VouteComponent key="vote"
                                item={state}
                                index={this.props.index}
                                updateVoteInComponent={()=>{}}
                                parent='post'
                />
                <Flag postIndex={this.props.index}/>
              </div>
              <div className="wrap-counts clearfix">
                <LikesComponent likes={state.net_likes}
                                url={state.url}/>
                <ShowIf show={parseFloat(state.total_payout_reward).toFixed(2)}>
                  <div
                    className="amount">${state.total_payout_reward}</div>
                </ShowIf>
              </div>
            </div>
            <div className="card-preview">
              {UserLinkFunc(null, state.title)}
              <Tags tags={state.tags}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  getComponentState() {
    return this.props.postsList.posts[this.props.index];
  }
  
}

const mapStateToProps = (state) => {
  return {
    postsList: state.postsList,
  };
};

export default connect(mapStateToProps)(Post);
