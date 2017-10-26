import React from 'react';
import {
    connect
} from 'react-redux';

class ModalComponent extends React.Component {
    render() {
        return (
            <div id="postModal" tabIndex="-1" role="dialog" aria-hidden="true" className="modal modal-post-single fade">
                <button type="button" data-dismiss="modal" aria-hidden="true" className="close"></button>
                <div className="modal-dialog">
                    <div className="modal-content js--close-if-touch">
                        {this.props.children}
                    </div>
                </div>
            </div>
        )
    }
}

export default ModalComponent;
