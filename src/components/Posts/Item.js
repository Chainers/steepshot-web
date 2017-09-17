import React from 'react';
import Modal from 'react-modal';
import {
  Link,
  Redirect
} from 'react-router-dom';
import {
  getPostComments
} from '../../actions/posts';
import ReactResizeDetector from 'react-resize-detector';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Comments from './Comments';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';
import ItemModal from './ItemModal';

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

  componentDidMount() {
    let propsItem = this.state.item;

    propsItem.total_payout_reward = '$' + parseFloat(propsItem.total_payout_reward).toFixed(2);

    propsItem.tags = (propsItem.tags instanceof Array) ? propsItem.tags : propsItem.tags.split(',');

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
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  componentWillUnmount() {
    this.closeModal();
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
      type: 'SET_SEARCH_VALUE',
      value: tagValue,
      text: tagValue.slice(1, tagValue.lenght),
      category: constants.CATEGORIES.tag
    });

    this.props.history.push('/browse');
  }

  redirectToUserProfile() {
    this.setState({ redirectToReferrer: true });
  }

  setDefaultAvatar() {
    this.setState({ avatar: 'src/images/person.png' });
  }

  setDefaultImage() {
    this.setState({ image: 'src/images/noimage.jpg' });
  }

  callPreventDefault(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  updateComponent(vote) {
    let currentItem = this.state.item;
    currentItem.vote = vote;
    vote ? currentItem.net_votes++ : currentItem.net_votes--;
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
    let itemImage = this.state.image || 'src/images/noimage.jpg';
    let authorImage = this.state.avatar || 'src/images/person.png';
    let comments = <Comments key="comments" item={this.state.item} />;

    let settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };

    const authorLink = `/userProfile/${this.state.item.author}`;

    return (
      <div className="item-wrap">
        <div className="post-card" >
          <div className="card-head clearfix">
            <div className="date">{this.state.item.created}</div>
            <Link to={authorLink} className="user">
              <div className="photo">
                <img src={authorImage} alt="User" onError={this.setDefaultAvatar.bind(this)}/>
              </div>
              <div className="name">{this.state.item.author}</div>
            </Link>
          </div>
          <div className="card-body" >
            <div className="card-pic" onClick={this.openModal}>
                <img src={itemImage} alt="User" onError={this.setDefaultImage.bind(this)}/>
              </div>
            <div className="card-wrap">
              <div className="card-controls clearfix">
                <div className="wrap-btn" onClick={(e)=>{this.callPreventDefault(e)}}>
                  <VouteComponent key="vote" 
                    item={this.state.item} 
                    updateComponent={this.updateComponent.bind(this)}
                  />
                </div>
                <div className="wrap-counts clearfix">
                  <div className="likes">{this.state.item.net_votes} likes</div>
                  <div className="amount">{this.state.item.total_payout_reward}</div>
                </div>
              </div>
              <div className="card-preview">{this.state.item.title}</div>
              <div className="card-tags clearfix">
                {
                  this.state.item.tags.map((tag, index) => {
                    return <a key={index} 
                      onClick={(event) => _this._research.bind(_this, event, tag)} 
                      >
                        {tag}
                      </a>
                  })
                }
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
          <ItemModal 
            openModal={this.openModal} 
            closeModal={this.closeModal} 
            item={this.props.item} 
            items={this.props.items} 
            index={this.props.index}
            updateComponent={this.updateComponent.bind(this)}
            _research={this._research.bind(this)}
          />
          <ReactResizeDetector 
            handleWidth 
            handleHeight 
            onResize={this._onResize.bind(this)}
          />
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
