import React from 'react';
import {connect} from 'react-redux';
import LikePostNotification from './LikePostNotification/LikePostNotification';
import LikeCommentNotification from './LikeCommentNotification/LikeCommentNotification';
import FollowUserNotification from './FollowUserNotification/FollowUserNotification';
import CommentPostNotification from './CommentPostNotification/CommentPostNotification';
import {openPushNot} from '../../actions/pushNotification';

class PushNotifications extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {

  }

  openLikePostNotification() {
    let pushNotBody = {
      pushNotBody: (<LikePostNotification avatar={'http://home.kpn.nl/bonge008/BLOG/profile/signature_square1.jpg'}
                                          username={'Isabel Gregory'}
                                          login={'joseph.kalu'}
                                          userMoney={0.35346}
                                          postPermlink={'test-2018-04-03-07-45-54'}/>)
    };
    // this.props.openPushNot(`LikePostNot-${this.props.login}-${new Date().getTime()}`, pushNotBody)
    this.props.openPushNot(`LikePostNot-${'joseph.kalu'}-${new Date().getTime()}`, pushNotBody);
  }

  openLikeCommentNotification() {
    let pushNotBody = {
      pushNotBody: (<LikeCommentNotification avatar={'http://home.kpn.nl/bonge008/BLOG/profile/signature_square1.jpg'}
                                             username={'Aaron Taylor'}
                                             login={'joseph.kalu'}
                                             userCommentMoney={0.067}
                                             postPermlink={'test-2018-04-03-07-45-54'}
                                             commentText={'A successful marketing plan relies heavily on the pulling-power ' +
                                             'of advertfhrtjtyesjejytsytsryjrtjrjrtjrtj ethwising copy'}/>)
    };
    // this.props.openPushNot(`LikeCommentNot-${this.props.login}-${new Date().getTime()}`, pushNotBody)
    this.props.openPushNot(`LikeCommentNot-${'joseph.kalu'}-${new Date().getTime()}`, pushNotBody);
  }

  openFollowUserNotification() {
    let pushNotBody = {
      pushNotBody: (<FollowUserNotification avatar={'http://home.kpn.nl/bonge008/BLOG/profile/signature_square1.jpg'}
                                            username={'Leonard Henry'}
                                            login={'joseph.kalu'}/>)
    };
    // this.props.openPushNot(`FollowUserNot-${this.props.login}-${new Date().getTime()}`, pushNotBody)
    this.props.openPushNot(`FollowUserNot-${'joseph.kalu'}-${new Date().getTime()}`, pushNotBody);
  }

  openCommentPostNotification() {
    let pushNotBody = {
      pushNotBody: (<CommentPostNotification avatar={'http://home.kpn.nl/bonge008/BLOG/profile/signature_square1.jpg'}
                                             username={'Miguel Marsh'}
                                             login={'joseph.kalu'}
                                             postPermlink={'test-2018-04-03-07-45-54'}
                                             commentText={'A successful marketing plan relies heavily on the pulling-power ' +
                                             'of advertfhrtjtyesjejytsytsryjrtjrjrtjrtj ethwising copy'}/>)
    };
    // this.props.openPushNot(`CommentPostNot-${this.props.login}-${new Date().getTime()}`, pushNotBody)
    this.props.openPushNot(`CommentPostNot-${'joseph.kalu'}-${new Date().getTime()}`, pushNotBody);
  }

  render() {
    return (
      <div ref={ref => {this.push = ref}}>
        {this.props.pushNotBody}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...state.pushNotifications[props.index]
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    openPushNot: (index, pushNotBody) => {
      dispatch(openPushNot(index, pushNotBody));
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PushNotifications);