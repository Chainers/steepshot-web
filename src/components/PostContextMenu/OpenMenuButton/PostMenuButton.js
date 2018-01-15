import * as React from 'react';

class PostMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="container_post-men-but" onClick={this.props.openFunc}
           style={this.props.style}>
        <img src="/static/images/postContextMenu/shape.png"
          className="shape_post-men-but"
          alt="Post menu button"
        />
      </div>
    );
  }
}

export default PostMenuButton;
