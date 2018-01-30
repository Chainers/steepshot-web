import * as React from 'react';

class ConfirmDeleteModal extends React.Component {
  constructor(props) {
    super(props);

  }

  closeModal(e) {
    e.stopPropagation();
    this.props.closeModal();
    this.props.deleteCallback(false);
  }

  closeAllModals(e) {
    e.stopPropagation();
    this.props.closeAllModals();
    this.props.deleteCallback(true);
  }

  render() {
    return (
      <div className="wrapper_confirm-del-mod">
          <div className="body_confirm-del-mod">
            <p className="title_confirm-del-mod">Do you want to delete this object?</p>
            <p className="description_confirm-del-mod">Are you sure that you want to remove this? It will be impossible to undo this action.</p>
          </div>
          <div className="buttons_holder-del-mod">
            <button className="btn btn-index" onClick={this.closeModal.bind(this)}>CANCEL</button>
            <button className="btn btn-default" onClick={this.closeAllModals.bind(this)}>DELETE</button>
          </div>
      </div>
    );
  }
}


export default ConfirmDeleteModal;
