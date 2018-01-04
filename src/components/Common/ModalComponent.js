import React from 'react';
import ShowIf from './ShowIf';

class ModalComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      closeParam : true
    }
  }

  componentWillMount() {
    this.closeButtonFunc();
    window.addEventListener('resize', () => {
      this.closeButtonFunc();
    })
  }

  closeButtonFunc() {
    if (document.documentElement.clientWidth <= 815) {
      this.setState({closeParam : false});
    } else {
      this.setState({closeParam : true});
    }
  }

  render() {
    return (
      <div id="postModal" tabIndex="-1" role="dialog" aria-hidden="true" className="modal modal-post-single fade">
        <ShowIf show={this.state.closeParam}>
            <button type="button" data-dismiss="modal" aria-hidden="true" className="close position--absolute"></button>
        </ShowIf>
        <div className="modal-dialog">
            <div className="modal-content js--dont-close-post-modal">
                {this.props.children}
            </div>
        </div>
      </div>
    )
  }
}

export default ModalComponent;
