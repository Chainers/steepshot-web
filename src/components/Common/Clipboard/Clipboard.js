import React from 'react';
import {connect} from "react-redux";

class Clipboard extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidUpdate() {
    $('#clipboard').select();
    try {
      document.execCommand('copy');
      jqApp.pushMessage.open("URL has been copied in your clipboard");
    } catch (e) {
      console.error(e.message);
      jqApp.pushMessage.open("Oops, unable to copy");
    }
  }

  render() {
    return (
      <textarea id="clipboard" className="clipboard" value={this.props.text} onChange={()=>{}}/>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    text: state.clipboard.text
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Clipboard);
