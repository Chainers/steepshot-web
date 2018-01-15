import React from 'react';
import PostsList from '../../PostsList/PostsList';

class Testing extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div
            className="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 col-sm-10 col-lg-offset-1 col-xs-12">
            <div className="main-container_test">
              <PostsList/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Testing;
