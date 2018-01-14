import React from 'react';
import {connect} from "react-redux";

class Clipboard extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidUpdate() {
    this.refs.clipboard.select();
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
      <textarea ref="clipboard" id="clipboard" className="clipboard" value={this.props.text}></textarea>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    text: state.clipboard.text
  };
};

export default connect(mapStateToProps)(Clipboard);
