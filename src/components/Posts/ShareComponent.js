import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Constants from '../../common/constants';

class ShareComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        ...this.props
    }
  }

  componentWillReciveProps(nextProps) {
    this.setState({
        ...nextProps
    });
  }

  getUrl() {
      return Constants.URLS.baseUrlPost + this.state.url;
  }

  onSuccess() {
      jqApp.pushMessage.open("URL was copied in clipboard");
  }

  render() {
    return (
        <div className={this.props.containerModifier}>
            <CopyToClipboard text={this.getUrl()}
                onCopy={() => this.onSuccess()}>
                <button className="btn btn-default btn-xs">{this.state.title}</button>
             </CopyToClipboard>
        </div>
    );
  }
}

ShareComponent.defaultProps = {
    containerModifier : '',
    url : '',
    title : 'share'
}

const mapStateToProps = (state) => {
  return {
    localization : state.localization
  };
};

export default connect(mapStateToProps)(ShareComponent);
