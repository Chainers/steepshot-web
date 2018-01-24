import React from 'react';
import {connect} from 'react-redux';
import {setPostModalOptions} from '../../../actions/postModal';
import constants from '../../../common/constants';
import TimeAgo from 'timeago-react';
import {Link} from 'react-router-dom';
import Avatar from '../../Common/Avatar/Avatar';
import {closeModal, setModalOptions} from '../../../actions/modal';
import ShowIf from '../../Common/ShowIf';

class PostModal extends React.Component {
  
  constructor(props) {
    super(props);
    this.setComponentSize = this.setComponentSize.bind(this);
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.setComponentSize);
    this.setComponentSize();
  }
  
  componentWillUnmount() {
    window.removeEventListener('resize', this.setComponentSize);
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
          <button title="Share this post"
                  className="btn btn-default btn-xs">
            Share post
          </button>
          <img src={this.props.post.body || constants.NO_IMAGE}
               alt="Post picture."
               style={this.props.style.image}
               ref={ref => this.image = ref}/>
        </div>
        
        <div className="header_pos-mod"
             ref={ref => this.headerContainer = ref}
             style={this.props.style.headerCont}>
          <div className="date_pos-mod">
            <TimeAgo datetime={this.props.post.created}
                     locale='en_US'
            />
            <ShowIf show={this.props.closeButton}>
              <div className="cont-close-btn_pos-mod"
                   onClick={() => this.props.closeModal(this.props.point)}>
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
             ref={ref => this.descContainer = ref}>
          test
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
    let headerOrder = 0;
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
      
      headerOrder = 2;
    } else {
      imgWidth = imgWidth < document.documentElement.clientWidth
        ? imgWidth
        : document.documentElement.clientWidth;
      imgHeight = imgHeight * imgWidth / this.image.naturalWidth;
      
      imgContWidth = '100%';
    }
    let closeButton;
    if (this.container.clientWidth + 100 <
      document.documentElement.clientWidth) {
      this.props.setModalOptions(this.props.point, {closeButton: true});
      closeButton = false;
    } else {
      this.props.setModalOptions(this.props.point, {closeButton: false});
      closeButton = true;
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
      headerCont: {
        order: headerOrder,
      },
    };
    this.props.setPostModalOptions({style, closeButton});
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.postModal,
    post: state.posts[state.postModal.currentIndex],
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
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
