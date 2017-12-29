import * as React from 'react';

class PostMenuButton extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="container_post-m-b">
        <img src="/static/images/postMenuButton/shape.png"
             srcSet="/static/images/postMenuButton/shape@2x.png 2x,
             /static/images/postMenuButton/shape@3x.png 3x"
             className="shape_post-m-b"
             alt="Post menu button"
        />
      </div>
    );
  }
}

export default PostMenuButton;
