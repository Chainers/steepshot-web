import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

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

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  afterOpenModal() {
    
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  render() {
    const _this = this;
    let textComponent = <div className="register" onClick={this.openModal.bind(this)}>Register</div>;

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
              <textarea className="text-block" placeholder="Input comment..." value={this.state.value} onChange={this.handleChange}></textarea>
            </div>
            <div className="buttons">
              <div className="button add">Add</div>
              <div className="button close-modal">Close</div>
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
    username: state.auth.user
  };
};

export default connect(mapStateToProps)(AddComment);
