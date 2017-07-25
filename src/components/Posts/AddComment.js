import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import steem from 'steem';

class AddComment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      item: this.props.item,
      modalIsOpen: false,
      value: ''
    };
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  handleChangeTextarea(event) {
    this.setState({
      value: event.target.value
    });
  }

  afterOpenModal() {
    //@TODO: if need
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  addComment() {
    const _this = this;
    const wif = this.props.postingKey;
    const urlObject = this.state.item.url.split('/');
    const permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    const parentAuthor = this.state.item.author;
    const author = this.props.username;
    const title = "";
    const body = this.state.value;
    const jsonMetadata = {
      tags: this.state.item.tags,
      app: 'steepshot/0.0.5' //@TODO get metadata from Backend
    };
    const parentPermlink = urlObject[urlObject.length-1];

    steem.broadcast.comment(wif, parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata, function(err, result) {
      if(err) {
        console.log(err);
      } else {
        _this.props.dispatch({
          type: 'UPDATE_COMMENTS'
        });
        _this.closeModal();
      }
    });
  }

  redirectToLoginPage() {
    this.closeModal();
    this.props.history.push('/signin');
  }

  render() {
    const _this = this;
    let textComponent = <div className="register" onClick={this.redirectToLoginPage.bind(this)}>Register</div>;

    if (this.props.username) {
        textComponent = <div className="add" onClick={this.openModal.bind(this)}>
          Add comment
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal.bind(_this)}
            onRequestClose={this.closeModal.bind(_this)}
            className='add-comment-container'
            contentLabel="Example Modal"
          >
            <div className="popup-header">
              <div className="popup-title">
                Comment
              </div>
              <button type="button" className="close col-lg-1 col-md-1 col-sm-1 col-xs-1"
                            onClick={this.closeModal.bind(_this)}>&times;</button>
            </div>
            <div>
              <textarea className="text-block" placeholder="Input comment..." value={this.state.value} onChange={(e) => this.handleChangeTextarea.call(_this, e)}></textarea>
            </div>
            <div className="buttons">
              <div className="button add" onClick={this.addComment.bind(_this)}>Add</div>
              <div className="button close-modal" onClick={this.closeModal.bind(_this)}>Close</div>
            </div>
          </Modal>
        </div>;
    }

    return (
        <div className="add-comment">
            {textComponent}
        </div>
    );
  }
}

AddComment.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default withRouter(connect(mapStateToProps)(AddComment));
