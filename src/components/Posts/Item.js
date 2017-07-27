import React from 'react';
import Modal from 'react-modal';
import { Link, Redirect } from 'react-router-dom';
import { getPostComments } from '../../actions/posts';
import ReactResizeDetector from 'react-resize-detector';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Comments from './Comments';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';
import AddComment from './AddComment';

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      modalIsOpen: false,
      currentIndex: this.props.index,
      comments: [],
      disableNext: false,
      disablePrev: false,
      redirectToReferrer: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  initKeypress() {
    const _this = this;

    document.onkeydown = function(e) {
      switch (e.keyCode) {
        case 37:
          _this.previous();
          break;
        case 39:
          _this.next();
          break;
      }
    };
  }

  componentDidMount() {
    let propsItem = this.state.item;

    propsItem.total_payout_reward = '$' + parseFloat(propsItem.total_payout_reward).toFixed(2);

    for (let i = 0; i < propsItem.tags.length; i++) {
      propsItem.tags[i] = '#' + propsItem.tags[i];
    }

    this.setState({
      item: propsItem,
      avatar: propsItem.avatar,
      image: propsItem.body 
    });
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  afterOpenModal() {
    this._onResize();
    this.initKeypress();
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  next() {
    const curIndex = this.state.currentIndex;
    if (curIndex + 2 == this.props.items.length) {
      this.props.loadMore();
    }

    if (curIndex == this.props.items.length) {
      this.setState({ disableNext: true });
    } else {
      const newItem = this.props.items[this.state.currentIndex + 1];
      this.resetDefaultProperties(newItem);
      this.setState({ currentIndex: this.state.currentIndex + 1 });
    }
  }

  componentWillUnmount() {
    this.closeModal();
  }

  previous() {
    if (this.state.currentIndex == 0) {
      this.setState({ disablePrev: true });
    } else {
      this.resetDefaultProperties(this.props.items[this.state.currentIndex - 1]);
      this.setState({ currentIndex: this.state.currentIndex - 1 });
    }
  }

  resetDefaultProperties(newItem) {
    this.setState({ 
      avatar: newItem.avatar,
      image: newItem.body,
      item: newItem
    });
  }

  _onResize() {
    const popupHeight = window.innerHeight - 200;

    $('#popup-image').height(popupHeight);
    $('#popup-info').height(popupHeight);
  }

  _research(e, tagValue) {
    e.stopPropagation();

    if (this.state.modalIsOpen) {
      this.setState({modalIsOpen: false});
    }

    this.props.dispatch({
      type: 'SET_VALUE',
      value: tagValue,
      category: constants.CATEGORIES.tag
    });
  }

  ratingVotes(event) {
    event.stopPropagation();
    console.log('Like.. ' + this.state.item.author + ' post');
  }

  redirectToUserProfile() {
    this.setState({ redirectToReferrer: true });
  }

  setDefaultAvatar() {
    this.setState({ avatar: '/src/images/person.png' });
  }

  setDefaultImage() {
    this.setState({ image: '/src/images/noimage.jpg' });
  }

  callPreventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  updateComponent(voute) {
    let currentItem = this.state.item;
    currentItem.voute = voute;
    voute ? currentItem.net_votes++ : currentItem.net_votes--;
    this.setState({ 
      item: currentItem
    });
  }

  _getPostImageStyles(itemImage) {
    return {
      backgroundImage: `url(${itemImage})`, 
      backgroundPosition: 'fixed', 
      backgroundRepeat: 'no-repeat', 
      backgroundOrigin: 'center', 
      backgroundClip: 'content-box', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center'
    };
  }

  render() {
    let _this = this;
    let itemImage = this.state.image || '/src/images/noimage.jpg';
    let authorImage = this.state.avatar || '/src/images/person.png';
    let comments = <Comments item={this.state.item} />;

    let settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const authorLink = `/userProfile/${this.state.item.author}`;

    return (
      <div className="post-container">
        <div className="post-container-item" onClick={this.openModal}>
          <div className="row body-row">
            <div className="post-img col-md-12 col-sm-12 col-xs-12" style={this._getPostImageStyles(itemImage)}></div>
          </div>
          <div className="row post-footer">
            <div className="main-info">
              <div className="">
                <img className="user-avatar" src={authorImage} alt="Image" onError={this.setDefaultAvatar.bind(this)}/>
              </div>
              <div className="">
                <Link to={authorLink}><strong>{this.state.item.author}</strong></Link>
              </div>
              <div onClick={(e)=>{this.callPreventDefault(e)}}>
                <VouteComponent item={this.state.item} updateComponent={this.updateComponent.bind(this)}/>
              </div>
            </div>
            <div className="author-info">
              <div className="author-info-block">
                <em className="tags-info">
                  {
                    this.state.item.tags.map((tag) => {
                      return <a onClick={(event) => _this._research(event, tag)} className="tags-urls">{tag}</a>
                    })
                  }
                </em>
              </div>
              <div className="payout-reward ">
                {this.state.item.total_payout_reward}
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal.bind(_this)}
          onRequestClose={this.closeModal}
          className='popout-container'
          contentLabel="Example Modal"
        >
          <div id="popup" className="custom-popup">
            <div className="my-modal">
              <div className="">
                <div className="popup-header">
                  <div className="popup-title">
                    {this.state.item.title}
                  </div>
                  <button type="button" className="close col-lg-1 col-md-1 col-sm-1 col-xs-1"
                          onClick={this.closeModal}>&times;</button>
                </div>
                <div className="popup-body">
                  <div className="popup-image-block" id="popup-image">
                    <img className="popup-image" src={itemImage} onError={this.setDefaultImage.bind(this)} alt="Image"/>
                  </div>
                  <div className="post-popup-info" id="popup-info">
                    <div className="author-info">
                      <div className="">
                        <img className="user-avatar" src={authorImage} alt="Image" onError={this.setDefaultAvatar.bind(this)} />
                      </div>
                      <div className="author-name">
                        <Link to={authorLink} onClick={this.closeModal}><strong>{this.state.item.author}</strong></Link>
                        <span>{this.state.item.about}</span>
                      </div>
                    </div>
                    <br/>
                    <div className="post-info">
                      <VouteComponent item={this.state.item} updateComponent={this.updateComponent.bind(this)}/>
                      <div className="">
                        <span className="payout-reward">{this.state.item.total_payout_reward} </span>
                      </div>
                    </div>
                    <div className="hash-tags">
                      {
                        this.state.item.tags.map((tag) => {
                          return <a onClick={(event) => _this._research(event, tag)} className="tags-urls">{tag}</a>
                        })
                      }
                    </div>
                    <div className="popup-comments">
                      {comments}
                    </div>
                    <AddComment item={this.props.item} />
                  </div>
                </div>
              </div>
            </div>
            <div className='slick-buttons'>
              <div className='left-button' onClick={this.previous.bind(_this)}>
                <img className='arrow' src="/src/images/arrow_left.png" alt="Previous post"/>
              </div>
              <div className='right-button' onClick={this.next.bind(_this)}>
                <img className='arrow' src="/src/images/arrow_right.png" alt="Next post"/>
              </div>
            </div>
          </div>
          <ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)}/>
        </Modal>
      </div>
    );
  }
}

Item.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(Item);
