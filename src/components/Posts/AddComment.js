import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import Steem from '../../libs/steem';

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

  _prepareTags(tags) {
    let preparedTags = [];

    tags.forEach((item) => {
      preparedTags.push(item.substr(1));
    });

    return preparedTags;
  }

  addComment() {
    const _this = this;
    const urlObject = this.state.item.url.split('/');
    const parentPermlink = urlObject[urlObject.length-1];
    const tags = this._prepareTags(this.state.item.tags);

    new Promise((resolve, reject) => {
      Steem.comment(this.props.postingKey, this.state.item.author, parentPermlink, 
        this.props.username, this.state.value, tags, resolve);
    }).then((result) => {
      if (result) {
        this.props.dispatch(result);
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
