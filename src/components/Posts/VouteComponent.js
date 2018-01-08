import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';
import utils from '../../utils/utils';

import Constants from '../../common/constants';
import { debounce } from 'lodash';

class VouteComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      item: this.props.item,
      vote: this.props.item.vote,
      parent: this.props.parent || 'post'
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: nextProps.index,
      item: nextProps.item,
      vote: nextProps.item.vote
    });
  }

  updateVoteInComponent(vote, index) {
    let newItem = this.state.item;
    if (vote && newItem.flag) {
      newItem.flag = false;
    }
    vote ? newItem.net_votes++ : newItem.net_votes--;
    newItem.vote = vote;
    this.setState({
      item: newItem
    });
  }

  ratingVotes(e) {
    e.preventDefault();

    if (!(this.props.username || this.props.postingKey)) {
      debounce(jqApp.pushMessage.open(Constants.VOTE_ACTION_WHEN_NOT_AUTH), Constants.VOTE_ACTION_WHEN_NOT_AUTH_DEBOUNCE);
      return false;
    }

    let queue = sessionStorage.getItem('voteQueue');
    if (queue == "true")  {
      return false;
    }

    sessionStorage.setItem('voteQueue', "true");

    if (!(this.props.username || this.props.postingKey)) {
      return false;
    }
    const newVoteState = !this.state.vote;
    const urlObject = this.state.item.url.split('/');
    this.setState({
      vote : newVoteState,
      isVoteLoading : true
    }, () => {

      const callback = (err, success) => {
        this.setState({
          isVoteLoading : false
        })
        sessionStorage.setItem('voteQueue', "false");
        if (err) {
          this.setState({
            vote: !newVoteState
          }, () => {
              let text = 'Something went wrong when you voted, please, try again later';
              if (err.payload.error.data.code == 10) {
                text = `Sorry, you had used the maximum number of vote changes on this ${this.state.parent}`;
              }
              jqApp.pushMessage.open(text);
            }
          );
        } else
        if (success) {
            let text = `${utils.capitalize(this.state.parent)} has been successfully liked. If you don't see your like, please give it a few minutes to sync from the blockchain`;
            if (!newVoteState) text = `${utils.capitalize(this.state.parent)} has been successfully disliked. If you don't see your dislike, please give it a few minutes to sync from the blockchain`;
            jqApp.pushMessage.open(text);
            this.updateVoteInComponent(newVoteState, this.state.index);
        }
      }

      Steem.vote(this.props.postingKey,
                this.props.username,
                this.state.item.author,
                urlObject[urlObject.length-1],
                newVoteState,
                callback
                );
    });
  }

  render() {
    let buttonClasses = "btn-like";
    if (this.state.vote) {
      buttonClasses = buttonClasses + " liked";
    }
    if (this.state.isVoteLoading) {
      buttonClasses = buttonClasses + " loading";
    }
    let button = <button type="button" className={buttonClasses}></button>
    return (
        <div className="wrap-btn" onClick={this.ratingVotes.bind(this)}>
          {button}
        </div>
    );
  }
}

VouteComponent.propTypes = {
  item: PropTypes.object
};

const mapStateToProps = (state) => {
  return {
    localization: state.localization,
    username: state.auth.user,
    postingKey: state.auth.postingKey
  };
};

export default connect(mapStateToProps)(VouteComponent);
