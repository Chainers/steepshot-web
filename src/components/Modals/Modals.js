import React from 'react';
import {connect} from 'react-redux';
import Modal from './Modal/Modal';

class Modals extends React.Component {
  
  constructor(props) {
    super(props);
  }
  
  render() {
    let modals = [];
    for(let key in this.props.modals) {
      modals.push(<Modal key={key} index={key}/>)
    }
    return (
      <div className="modals-component_mod">
        {modals}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    modals: state.modals,
  };
};

export default connect(mapStateToProps)(Modals);
