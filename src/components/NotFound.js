import React from 'react'
import {documentTitle} from './DocumentTitle';

class NotFound extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    documentTitle();
  }

  render() {
    return (
      <div className="g-main">
        <div className="g-main_i container">
          <div className="row">
            <div id="workspace" className="g-content col-xs-12 clearfix">
              <h1 id="title" className="hidden">404</h1>
              <div className="empty-query-message">
                <div className="eqm-ttl">404 error</div>
                Ooops… Page not found. Try to refresh this page or check your internet connection.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
