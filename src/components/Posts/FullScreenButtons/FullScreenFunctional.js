import React from 'react';

class FullScreenFunctional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vote: this.props.item.vote
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({vote: nextProps.item.vote, index: nextProps.index, number: nextProps.number}, () => {
      this.arrowControl();
    });
  }

  arrowControl() {
    if (this.state.index == 0) {
      this.lArr.style.opacity = '.7';
      this.lArr.style.cursor = 'not-allowed';
    } else {
      this.lArr.style.opacity = '1';
      this.lArr.style.cursor = 'pointer';
    }
    if (this.state.index == this.state.number - 1) {
      this.rArr.style.opacity = '.7';
      this.rArr.style.cursor = 'not-allowed';
    } else {
      this.rArr.style.opacity = '1';
      this.rArr.style.cursor = 'pointer';
    }
  }

  render() {
    let like = null;
    if (this.state.vote) {
      like = 'DISLIKE';
    } else {
      like = 'LIKE';
    }
    return (
      <div className="buttons-wrapper_fsf" style={{left : this.props.offset}}>
        <div className="button_fsf" onClick={this.props.prev} ref={ ref => {this.lArr = ref} }>
          <div className="arrow-left-img_fsf"/>
          <p className="text_fsf">PREV</p>
        </div>
        <div className="button_fsf" onClick={this.props.next} ref={ ref => {this.rArr = ref} }>
          <div className="arrow-right-img_fsf"/>
          <p className="text_fsf">NEXT</p>
        </div>
        <div className="button_fsf" onClick={this.props.like}>
          <div className="like-img_fsf"/>
          <p className="text_fsf">{like}</p>
        </div>
        <div className="button_fsf_esc">
          <div className="escape-img_fsf"/>
          <p className="text_fsf">TURN</p>
        </div>
      </div>
    )
  }
}

export default FullScreenFunctional;
