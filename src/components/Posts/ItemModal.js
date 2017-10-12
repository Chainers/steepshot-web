import React from 'react';
import {
  Link,
  Redirect
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
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
            redirectToReferrer: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextProps == this.props && nextState == this.state) return false;
      return true;
    }

    setDefaultAvatar() {
      this.setState({ 
        avatar: constants.NO_AVATAR 
      });
    }

    setDefaultImage() {
      this.setState({
        image: constants.NO_IMAGE
      });
    }

    redirectToUserProfile() {
      this.setState({ redirectToReferrer: true });
    }

    getFormatedDate() {
      const date = new Date(this.state.item.created);
      const locale = "en-us";
  
      return date.getDate() + ' ' + date.toLocaleString(locale, { month: "short" }) + ' ' + date.getFullYear();
    }

    render() {
      let _this = this;
      let itemImage = this.state.image || constants.NO_IMAGE;
      let authorImage = this.state.avatar || constants.NO_AVATAR;
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
        <div className="post-single">
          <div className="post-wrap clearfix">
            <div className="wrap-slider not-init">
              <div className="slider clearfix">
                <div className="slide">
                  <img src={itemImage} 
                    onError={this.setDefaultImage.bind(this)} 
                    alt="image" 
                  />
                </div>
              </div>
            </div>
            <div className="wrap-description">
              <div className="post-header">
                <div className="user-wrap clearfix">
                  <div className="date">{this.getFormatedDate()}</div>
                  <Link to={authorLink} className="user">
                    <div className="photo">
                      <img src={authorImage} 
                        alt="Image" 
                        onError={this.setDefaultAvatar.bind(this)} />
                    </div>
                    <div className="name">{this.state.item.author}</div>
                  </Link>
                </div>
              </div>
              <div className="post-controls clearfix">
                <div className="wrap-btn" onClick={this.props.callPreventDefault}>
                  <VouteComponent
                    key="vote"
                    item={this.state.item}
                    index={this.state.currentIndex}
                    updateVoteInComponent={this.props.updateVoteInComponent}
                  />
                </div>
                <div className="wrap-counts clearfix">
                  <div className="likes">{this.state.item.net_votes} like's</div>
                  <div className="amount">{this.state.item.total_payout_reward}</div>
                </div>
              </div>
              <div className="list-scroll">
                <div className="post-description">
                  <p>{this.state.item.title}</p>
                  <div className="post-tags clearfix">
                    {
                      this.state.item.tags.map((tag, index) => {
                        return <a key={index}
                          onClick={(event) => this.props._research.bind(this, event, tag)} 
                          >
                            {tag}
                          </a>
                      })
                    }
                  </div>
                </div>
                {comments}
              </div>
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
