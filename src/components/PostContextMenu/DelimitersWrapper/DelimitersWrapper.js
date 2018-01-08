import * as React from 'react';
import ShowIf from '../../Common/ShowIf';
import Delimiter from './Delimiter/Delimiter';

class DelimitersWrapper extends React.Component {
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
          <ShowIf show={this.props.hasDelimiter && !this.props.smallScreen}>
            <Delimiter horizontal={false}/>
          </ShowIf>
        </div>
        <ShowIf show={this.props.hasDelimiter && this.props.smallScreen}>
          <Delimiter horizontal={true}/>
        </ShowIf>
      </div>
    );
  }
}

export default DelimitersWrapper;
