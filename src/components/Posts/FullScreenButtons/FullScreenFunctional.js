import React from 'react';

class FullScreenFunctional extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    return (
      <div className="buttons-wrapper_fsf">
        <div className="button_fsf">
          <div className="arrow-left-img_fsf"/>
          <p className="text_fsf">PREW</p>
        </div>
        <div className="button_fsf">
          <div className="arrow-right-img_fsf"/>
          <p className="text_fsf">NEXT</p>
        </div>
        <div className="button_fsf">
          <div className="like-img_fsf"/>
          <p className="text_fsf">ENTER</p>
        </div>
        <div className="button_fsf">
          <div className="escape-img_fsf"/>
          <p className="text_fsf">CLOSE</p>
        </div>
      </div>
    )
  }
}

export default FullScreenFunctional;
