import React from 'react';
import {
  connect
} from 'react-redux';

class LikesComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.props,
      likeParam: 2
    };
  }

  componentDidMount() {
    this.likeControl();
  }

  likeControl() {
    switch (this.state.likes) {
      case 0 :
        this.setState({likeParam: 0});
        break;
      case 1 :
        this.setState({likeParam: 1});
        break;
      case -1 :
        this.setState({likeParam: 1});
        break;
    }
  }

  openLikesModal() {
      this.props.dispatch({ type : 'CLEAR_LIKES_INFO', url : this.state.url })
      jqApp.openLikesModal($(document));
  }

  render() {
    const {likes, persons} = this.state;
    return (
      <div>
        {
          this.state.likeParam == 0
          ?
            null
          :
            this.state.likeParam == 1
          ?
            <div className="likes" onClick={this.openLikesModal.bind(this)}>{likes} like</div>
          :
            <div className="likes" onClick={this.openLikesModal.bind(this)}>{likes} likes</div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization
  };
};

export default connect(mapStateToProps)(LikesComponent);
