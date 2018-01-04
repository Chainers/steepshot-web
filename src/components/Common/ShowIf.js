import React from 'react';
import PropTypes from 'prop-types';

class ShowIf extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (this.props.show ? this.props.children : null)
  }
}

ShowIf.propTypes = {
  show: PropTypes.bool.isRequired
};

export default ShowIf;
