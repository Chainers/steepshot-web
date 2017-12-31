import * as React from 'react';
import ShowIf from '../Common/ShowIf';
import cookie from 'react-cookies';

class ActionInfo extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      closed: false,
    };
  }
  
  componentWillMount() {
    if (cookie.load('closed_action-info')) {
      this.setState({
        closed: true,
      });
    }
  }
  
  closeComponent(e) {
    e.preventDefault();
    cookie.save(
      'closed_action-info',
      'true',
      {
        maxAge: 60 * 60 * 24,
      },
    );
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
                  <b className="title">Happy New Year Contest 2018!<br/></b>
                  Post a photo on the New Year theme untill 5.01.2018, select
                  one of the tags: #steepshotcontest #steepshotchallenge.
                  <a
                    href="https://steemit.com/steem/@steepshot/new-year-2018-photochallenge-for-steepshot-users-150-steem-reward-for-the-best-10-photos"
                    target="_blank"> More info</a>
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
