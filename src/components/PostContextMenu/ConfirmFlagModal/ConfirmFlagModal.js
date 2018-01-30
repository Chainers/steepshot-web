import * as React from 'react';
import {Link} from 'react-router-dom';

class ConfirmFlagModal extends React.Component {
  constructor(props) {
    super(props);

  }

  closeModal(e) {
    e.stopPropagation();
    this.props.closeModal();
    this.props.flagCallback(false);
  }

  render() {
    return (
      <div className="wrapper_confirm-flag-mod">
        <div className="body_confirm-flag-mod">
          <p className="title_confirm-flag-mod">Flagging a post can remove rewards and make this material less visible.</p>
          <p className="description_confirm-flag-mod">Some common reasons to flag:</p>
          <p className="description_confirm-flag-mod">- Disagreement on rewards, Fraud or Plagiarism,
            Hate Speech or Internet Trolling, Intentional miss-categorized content or Spam.</p>
          <p className="description-link_confirm-flag-mod">
            <Link to="/guide">Link to our guidelines</Link>
          </p>
        </div>
        <div className="buttons_holder-flag-mod">
          <button className="btn btn-index" onClick={this.closeModal.bind(this)}>CANCEL</button>
          <button className="btn btn-default" onClick={() => {this.props.flagCallback(true)}}>FLAG</button>
        </div>
      </div>
    );
  }
}


export default ConfirmFlagModal;
