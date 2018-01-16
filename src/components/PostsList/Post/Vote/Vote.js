import React from 'react';
import {connect} from 'react-redux';
import * as utils from 'lodash';
import {debounce} from 'lodash';
import {toggleFlag} from '../../../../actions/flag';
import Constants from '../../../../common/constants';

class Vote extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      index: this.props.index,
      item: this.props.item,
      vote: this.props.item.vote,
      parent: this.props.parent || 'post',
    };
  }
  

  
  ratingVotes(e) {
    e.preventDefault();
    
    if (!(this.props.username || this.props.postingKey)) {
      debounce(jqApp.pushMessage.open(Constants.VOTE_ACTION_WHEN_NOT_AUTH),
        Constants.VOTE_ACTION_WHEN_NOT_AUTH_DEBOUNCE);
      return false;
    }
    
    let queue = sessionStorage.getItem('voteQueue');
    if (queue == 'true') {
      return false;
    }
    
    sessionStorage.setItem('voteQueue', 'true');
    

    const newVoteState = !this.state.vote;
    const urlObject = this.state.item.url.split('/');
    this.setState({
      vote: newVoteState,
      isVoteLoading: true,
    }, () => {
      
      const callback = (err, success) => {
        this.setState({
          isVoteLoading: false,
        });
        sessionStorage.setItem('voteQueue', 'false');
        if (err) {
          this.setState({
              vote: !newVoteState,
            }, () => {
              let text = 'Something went wrong when you voted, please, try again later';
              if (err.data.code == 10) {
                text = `Sorry, you had used the maximum number of vote changes on this ${this.state.parent}`;
              }
              jqApp.pushMessage.open(text);
            },
          );
        } else if (success) {
          let text = `${utils.capitalize(
            this.state.parent)} has been successfully liked. If you don't see your like, please give it a few minutes to sync from the blockchain`;
          if (!newVoteState) text = `${utils.capitalize(
            this.state.parent)} has been successfully disliked. If you don't see your dislike, please give it a few minutes to sync from the blockchain`;
          jqApp.pushMessage.open(text);
          this.props.updateVoteInComponent(newVoteState, this.state.index);
        }
      };
      
      Steem.vote(this.props.postingKey,
        this.props.username,
        this.state.item.author,
        urlObject[urlObject.length - 1],
        newVoteState,
        callback,
      );
    });
  }
  
  render() {
    let buttonClasses = 'btn-like';
    if (this.state.vote) {
      buttonClasses = buttonClasses + ' liked';
    }
    if (this.state.isVoteLoading) {
      buttonClasses = buttonClasses + ' loading';
    }
    return (
      <div className="wrap-btn" onClick={this.ratingVotes.bind(this)}>
        <button type="button" className={buttonClasses}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleFlag: (postIndex) => {
      dispatch(toggleFlag(postIndex));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vote);
