import * as React from 'react';
import ShowIf from '../Common/ShowIf';

class ActionInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: false,
    };
  }
  
  closeComponent(e) {
    e.preventDefault();
    this.setState({
      closed: true,
    });
  }
  
  moveTo() {
    this.setState({
      closed: true,
    });
  }
  
  render() {
    return (
      <ShowIf show={!this.state.closed}>
        <div className="container_action-info">
          <div className="container-fluid">
            <div className="row">
              <div className="col-xs-10 col-md-11 col-lg-11 text-center">
                <p className="message_action-info">
                  <b>Happy New Year Contest 2018!<br/></b>
                  Post a photo on the New Year theme untill 5.01.2018, select
                  one of the tags: #steepshotcontest #steepshotchallenge.<br/>
                  <a
                    href="https://steemit.com/steem/@steepshot/new-year-2018-photochallenge-for-steepshot-users-150-steem-reward-for-the-best-10-photos"
                    target="_blank"
                    onClick={this.moveTo.bind(this)}>More info</a>
                </p>
              </div>
              <div className="col-xs-2 col-md-1 col-lg-1 float-right">
                <img src="/static/images/close_button.png"
                     className="shape-close-button"
                     onClick={this.closeComponent.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      </ShowIf>
    );
  }
}

export default ActionInfo;
