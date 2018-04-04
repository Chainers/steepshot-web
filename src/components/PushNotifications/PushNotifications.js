import React from 'react';
import {connect} from 'react-redux';
import './pushNotifications.css';
import PushNotification from './PushNotification';

class PushNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    
  }

  render() {
    let notifications = [];
    for (let key in this.props.notifications) {
      notifications.push(<PushNotification key={key} index={key}/>);
    }
    return (
      <div className="wrapper_push-not">
        {notifications}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.pushNotifications
  }
};

export default connect(mapStateToProps)(PushNotifications);