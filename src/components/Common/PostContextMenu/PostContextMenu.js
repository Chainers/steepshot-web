import * as React from 'react';
import PostMenuButton from './OpenMenuButton/PostMenuButton';
import Modal from './Modal/Modal';

class PostContextMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.setShow = this.setShow.bind(this);
  }
  
  setShow(flag) {
    event.stopPropagation();
    this.setState({
      showModal: flag
    })
  }
  
  render() {
    return (
      <div className="container_pos-con-men">
        <PostMenuButton setShow={this.setShow}/>
        <Modal show={this.state.showModal} setShow={this.setShow}>
            test
        </Modal>
      </div>
    );
  }
}

export default PostContextMenu;
