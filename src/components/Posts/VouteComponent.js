import React from 'react';
import {
  Link
} from 'react-router-dom';
import {
  voute
} from '../../actions/raitingVoute';
import {
  connect
} from 'react-redux';
import PropTypes from 'prop-types';
import Steem from '../../libs/steem';

class VouteComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: this.props.index,
      item: this.props.item,
      vote: this.props.item.vote
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: this.props.index,
      item: this.props.item,
      vote: this.props.item.vote
    });
  }

  ratingVotes(e) {

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
                text = 'Sorry, you had used the maximum number of vote changes on this post';
              }
              jqApp.pushMessage.open(text);
            }
          ); 
        } else 
        if (success) {
            let text = 'Post was successfully liked';
            if (!newVoteState) text = 'Post was successfully disliked';
            jqApp.pushMessage.open(text);
            this.props.updateVoteInComponent(newVoteState, this.state.index)
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
    let component = <button type="button" className={buttonClasses}></button>;
    
    return (
        <div className="wrap-btn" onClick={this.ratingVotes.bind(this)}>
          {component}
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
