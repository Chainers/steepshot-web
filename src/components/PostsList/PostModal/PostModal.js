import React from 'react';
import {connect} from 'react-redux';

class PostModal extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return (
      <div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
