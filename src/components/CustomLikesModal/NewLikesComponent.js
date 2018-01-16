import * as React from 'react';
import Modal from '../Common/Modal/Modal';
import LikesComponent from './LikesComponent';
import {connect} from 'react-redux';
import UserLikes from './UserLikes';

class NewLikesComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    }
  }

  closeFunc() {
    this.setState({
      showModal: false,
    });
  }

  openFunc() {
    this.setState({
      showModal: true,
    });
  }

  render() {
    return (
      <div className="container_pos-con-men">
        <LikesComponent
          openFunc={this.openFunc.bind(this)}
          closeFunc={this.closeFunc.bind(this)}
          likes={this.props.likes}
          url={this.props.url}
        />
        <Modal
          show={this.state.showModal}
          closeFunc={this.closeFunc.bind(this)}
          fullScreen={false}
          closeButton={false}
          styles={'container_mod'}
        >
          <UserLikes url={this.props.url} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(NewLikesComponent);
