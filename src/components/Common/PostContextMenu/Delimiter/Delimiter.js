import * as React from 'react';
import ShowIf from '../../ShowIf';

class Delimiter extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="wrapper_del">
        <div className="vertical-wrapper_del">
          <div className="content_del">
            {this.props.children}
          </div>
          <ShowIf show={this.props.hasDelimiter}>
            <div className="center_del">
              <div className="delimiter_del vertical_del"></div>
            </div>
          </ShowIf>
        </div>
        <div className="horizontal-wrapper_del">
          <ShowIf show={this.props.hasDelimiter}>
            <div className="center_del">
              <div className="delimiter_del horizontal_del"></div>
            </div>
          </ShowIf>
        </div>
      </div>
    );
  }
}

export default Delimiter;
