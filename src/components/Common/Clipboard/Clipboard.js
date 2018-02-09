import React from 'react';
import {connect} from "react-redux";
import {CopyToClipboard} from "react-copy-to-clipboard";

class  Clipboard extends React.Component {
  constructor(props){
    super(props);
  }

  componentDidUpdate() {
    try {
      this.button.click();
      jqApp.pushMessage.open("URL has been copied in your clipboard");
    } catch (e) {
      jqApp.pushMessage.open("Oops, unable to copy");
    }
  }

  render() {
    return (
      <CopyToClipboard text={this.props.text}
                       onCopy={() => {}}
                       className="clipboard">
        <span ref={ref => this.button = ref}>Copy to clipboard</span>
      </CopyToClipboard>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.clipboard
  };
};

export default connect(mapStateToProps)(Clipboard);
