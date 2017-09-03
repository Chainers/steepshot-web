import React from 'react';
import { 
    Link, 
    Redirect 
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class PopoutFollowItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item,
            image: this.props.item.avatar
        };
    }

    setDefaultAvatar() {
        this.setState({ avatar: 'src/images/person.png' });
    }

    redirectToUserProfile() {
        this.setState({ redirectToReferrer: true });
    }

    resetDefaultProperties(newItem) {
        this.setState({ 
            avatar: newItem.avatar,
            image: newItem.body,
            item: newItem
        });
    }

    render() {
        let _this = this;
        let authorImage = this.state.avatar || 'src/images/person.png';

        let settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
        };

        const authorLink = `/userProfile/${this.state.item.author}`;

        const followElement = this.state.item.has_followed ?
          <div className="follow-button">Follow</div> : <div className="follow-button">Unfollow</div>


        return(
          <div id="popup-info">
            <div className="follow-info">
              <div className="">
                <img className="user-avatar" 
                  src={authorImage} 
                  alt="Image" 
                  onError={this.setDefaultAvatar.bind(this)} />
              </div>
              <div className="author-name">
                <Link to={authorLink} onClick={this.props.closeModal}>
                  <strong>{this.state.item.author}</strong>
                </Link>
              </div>
              <div>
                { followElement }
              </div>
            </div>
          </div>
        );
    }
}

PopoutFollowItem.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(PopoutFollowItem);