import * as React from 'react';

class PostMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="container_post-men-but" onClick={this.props.openFunc}>
        <img src="/static/images/postMenuButton/shape.png"
          className="shape_post-men-but"
          alt="Post menu button"
        />
      </div>
    );
  }
}

export default PostMenuButton;
