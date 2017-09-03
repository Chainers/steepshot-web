import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Comments from './Comments';
import PropTypes from 'prop-types';
import constants from '../../common/constants';
import VouteComponent from './VouteComponent';
import AddComment from './AddComment';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item,
            currentIndex: this.props.index,
            image: this.props.item.body,
            comments: [],
            disableNext: false,
            disablePrev: false,
            redirectToReferrer: false
        };

        this.initKeypress();
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

    setDefaultAvatar() {
        this.setState({ avatar: 'src/images/person.png' });
    }

    setDefaultImage() {
        this.setState({ image: 'src/images/noimage.jpg' });
    }

    redirectToUserProfile() {
        this.setState({ redirectToReferrer: true });
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

    resetDefaultProperties(newItem) {
        this.setState({ 
            avatar: newItem.avatar,
            image: newItem.body,
            item: newItem
        });
    }

    previous() {
        if (this.state.currentIndex == 0) {
            this.setState({ disablePrev: true });
        } else {
            this.resetDefaultProperties(this.props.items[this.state.currentIndex - 1]);
            this.setState({ currentIndex: this.state.currentIndex - 1 });
        }
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


        return(
            <div id="popup" className="custom-popup">
            <div className="my-modal">
              <div className="">
                <div className="popup-header">
                  <div className="popup-title">
                    {this.state.item.title}
                  </div>
                  <button type="button" className="close col-lg-1 col-md-1 col-sm-1 col-xs-1"
                          onClick={this.props.closeModal}>&times;</button>
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
                        <Link to={authorLink} onClick={this.props.closeModal}><strong>{this.state.item.author}</strong></Link>
                        <span>{this.state.item.about}</span>
                      </div>
                    </div>
                    <br/>
                    <div className="post-info">
                      <VouteComponent key="vote" item={this.state.item} updateComponent={this.props.updateComponent}/>
                      <div className="">
                        <span className="payout-reward">{this.state.item.total_payout_reward} </span>
                      </div>
                    </div>
                    <div className="hash-tags">
                      {
                        this.state.item.tags.map((tag, index) => {
                          return <a key={index} onClick={(event) => _this.props._research(event, tag)} className="tags-urls">{tag}</a>
                        })
                      }
                    </div>
                    <div className="popup-comments">
                      {comments}
                    </div>
                    <AddComment key="comment" item={this.props.item} />
                  </div>
                </div>
              </div>
            </div>
            <div className='slick-buttons'>
              <div className='left-button' onClick={this.previous.bind(_this)}>
                <img className='arrow' src="src/images/arrow_left.png" alt="Previous post"/>
              </div>
              <div className='right-button' onClick={this.next.bind(_this)}>
                <img className='arrow' src="src/images/arrow_right.png" alt="Next post"/>
              </div>
            </div>
          </div>
        );
    }
}

ItemModal.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(ItemModal);