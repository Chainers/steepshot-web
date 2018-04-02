import React from 'react';
import {connect} from 'react-redux';
import './pushNotifications.css';

class PushNotifications extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="wrapper_push-not">

            </div>
        );
    }
}

const mapStateToProps = {

};

const mapDispatchToProps = {

};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotifications);