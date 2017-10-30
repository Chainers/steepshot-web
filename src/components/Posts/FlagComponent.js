import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';

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
      index: nextProps.index,
      item: nextProps.item,
      flag: nextProps.item.flag,
      isFlagLoading: false
    });
  }

  updateFlag(e) {

    e.preventDefault();

    if (!(this.props.username || this.props.postingKey)) {
      return false;
    }

    let queue = sessionStorage.getItem('voteQueue');
    if (queue == "true")  {
      return false;
    }

    sessionStorage.setItem('voteQueue', "true");

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
        sessionStorage.setItem('voteQueue', "false");
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
            let text = `The post has been successfully flaged. If you don't see your flag, please give it a few minutes to sync from the blockchain`;
            if (!newFlagState) text = `The post has been successfully unflaged. If you don't see your flag, please give it a few minutes to sync from the blockchain`;
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
        <div className="wrap-btn" onClick={this.updateFlag.bind(this)}>
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
