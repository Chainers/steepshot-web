import React from 'react';
import Steem from '../../libs/steem';
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
import FlagComponent from './FlagComponent';
import LoadingSpinner from '../LoadingSpinner';

class ItemModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            item: this.props.item,
            index: this.props.index,
            image: this.props.item.body,
            comments: [],
            disableNext: false,
            disablePrev: false,
            redirectToReferrer: false,
            commentValue: '',
            needsCommentFormLoader : false
        };

        this.initKeypress();
    }

    componentWillReceiveProps(nextProps){
      this.setState({
        item: nextProps.item,
        index: nextProps.index,
        image: nextProps.item.body,
        comments: [],
        disableNext: false,
        disablePrev: false,
        redirectToReferrer: false
      });
    }

    componentDidMount() {
      setTimeout(() => { 
        jqApp.forms.init();
        jqApp.post.init()
      }, 0);
    }

    sendComment(e) {
      e.preventDefault();

      if (this.state.commentValue == "") return false;

      const urlObject = this.state.item.url.split('/');

      const callback = (err, success) => {
        this.setState({
          needsCommentFormLoader : false
        });
        if (err) {
          // this.setState({ 
          //   vote: !newVoteState
          // }, () => {
          //     let text = 'Something went wrong when you voted, please, try again later';
          //     if (err.payload.error.data.code == 10) {
          //       text = 'Sorry, you had used the maximum number of vote changes on this post';
          //     }
          //     jqApp.pushMessage.open(text);
          //   }
          // ); 
        } else 
        if (success) {
            // let text = 'Post was successfully liked';
            // if (!newVoteState) text = 'Post was successfully disliked';
            // jqApp.pushMessage.open(text);
            // this.props.updateVoteInComponent(newVoteState, this.state.index)
        }
      }

      this.setState({
        needsCommentFormLoader : true
      }, () => {
        Steem.comment(
          this.props.postingKey,             
          this.state.item.author, 
          urlObject[urlObject.length - 1], 
          this.props.username, 
          this.state.commentValue,
          this.state.item.tags,
          callback
        );
      });
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

    handleChange(event) {
      let name = event.target.name;
      let value = event.target.value;
      this.setState({ 
          [name] : value
      });
    }

    next() {
      const curIndex = this.state.index;
      if (curIndex + 2 == this.props.items.length) {
          this.props.loadMore();
      }

      if (curIndex == this.props.items.length) {
          this.setState({ disableNext: true });
      } else {
          const newItem = this.props.items[this.state.index + 1];
          this.resetDefaultProperties(newItem);
          this.setState({ index: this.state.index + 1 });
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
      if (this.state.index == 0) {
          this.setState({ disablePrev: true });
      } else {
          this.resetDefaultProperties(this.props.items[this.state.index - 1]);
          this.setState({ index: this.state.index - 1 });
      }
    }

    getFormatedDate() {
      const date = new Date(this.state.item.created);
      const locale = "en-us";
  
      return date.getDate() + ' ' + date.toLocaleString(locale, { month: "short" }) + ' ' + date.getFullYear();
    }

    callPreventDefault(e) {
      e.stopPropagation();
      e.preventDefault();
    }

    render() {

      let _this = this;
      let itemImage = this.state.image || constants.NO_IMAGE;
      let authorImage = this.state.avatar || constants.NO_AVATAR;
      let comments = <Comments key="comments" item={this.state.item} comment={this.state.newComment}/>;

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
                <div className="buttons-row" onClick={(e)=>{this.callPreventDefault(e)}}>
                  <VouteComponent key="vote" 
                    key="vote"
                    item={this.state.item}
                    index={this.state.index}
                    updateVoteInComponent={this.props.updateVoteInComponent}
                  />
                  <FlagComponent 
                    key="flag"
                    item={this.state.item}
                    index={this.state.index}
                    updateFlagInComponent={this.props.updateFlagInComponent}
                  />
                </div>
                <div className="wrap-counts clearfix">
                  <div className="likes">{this.state.item.net_votes} like's</div>
                  <div className="amount">{this.state.item.total_payout_reward}</div>
                </div>
              </div>
              <div className="post-comment">
                <form className="comment-form form-horizontal">
                  <div className="form-group clearfix">
                    <div className="btn-wrap">
                      <button type="submit" className="btn-submit" onClick={this.sendComment.bind(this)}>Send</button>
                    </div>
                    <div className="input-container">
                      <textarea id="formCOMMENT" 
                                name="commentValue"
                                value={this.state.commentValue} 
                                spellCheck="true" 
                                className="form-control"
                                onChange={this.handleChange.bind(this)}>
                      </textarea>
                      <label htmlFor="formCOMMENT" className="name">Comment</label>
                    </div>
                  </div>
                </form>
                {
                  this.state.needsCommentFormLoader
                  ?
                    <LoadingSpinner />
                  :
                    null
                }
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
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(ItemModal);