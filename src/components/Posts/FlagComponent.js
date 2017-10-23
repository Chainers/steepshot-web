import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';

import { getStore } from '../../store/configureStore';

class FlagComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      item: this.props.item,
      flag: this.props.item.flag,
      isFlagLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: this.props.index,
      item: this.props.item,
      flag: this.props.item.flag
    });
  }

  updateFlag() {

    if (!getStore().getState().votes.voteCanBePushed)  {
      return false;
    }

    this.props.dispatch({ type : 'SWITCH_MODE_FOR_QUEUE', voteCanBePushed : false });

    if (!(this.props.username || this.props.postingKey)) {
      return;
    }
    const newFlagState = !this.state.flag;
    const urlObject = this.state.item.url.split('/');

    this.setState({ 
      flag : newFlagState,
      isFlagLoading : true
    }, () => {

      const callback = (err, success) => {
        this.setState({
          isFlagLoading : false
        })
        this.props.dispatch({ type : 'SWITCH_MODE_FOR_QUEUE', voteCanBePushed : true });
        if (err) {
          this.setState({ 
            flag: !newFlagState
          }, () => {
              let text = 'Something went wrong when you clicked the flag, please, try again later';
              if (err.payload.error.data.code == 10) {
                text = 'Sorry, you had used the maximum number of vote changes on this post';
              }
              jqApp.pushMessage.open(text);
            }
          ); 
        } else 
        if (success) {
            let text = 'Post was successfully flagged';
            if (!newFlagState) text = 'Flag was successfully removed';
            jqApp.pushMessage.open(text);
            this.props.updateFlagInComponent(newFlagState, this.state.index)
        }
      }

      Steem.flag(this.props.postingKey, 
                this.props.username, 
                this.state.item.author, 
                urlObject[urlObject.length-1], 
                newFlagState,
                callback
                );
    });
  }

  render() {
    let buttonClasses = "btn-flag";
    if (this.state.flag) {
      buttonClasses = buttonClasses + " marked";
    }
    if (this.state.isFlagLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    let component = <button type="button" className={buttonClasses}></button>;
    
    return (
        <div className="wrap-btn" onClick={(event) => this.updateFlag.call(this, event)}>
          {component}
        </div>
    );
  }
}

FlagComponent.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(FlagComponent);
